import * as vscode from "vscode";
import { getNonce, getUri } from "../utilities";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Listen for messages from the Sidebar component and execute action
    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "onFetchText": {
          let editor = vscode.window.activeTextEditor;

          if (editor === undefined) {
            vscode.window.showErrorMessage("No active text editor");
            return;
          }

          let text = editor.document.getText(editor.selection);
          // send message back to the sidebar component
          this._view?.webview.postMessage({
            type: "onSelectedText",
            value: text,
          });
          break;
        }
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const stylesUri = getUri(webview, this._extensionUri, [
      "sidebar-ui",
      "dist",
      "assets",
      "index.css",
    ]);

    const scriptUri = getUri(webview, this._extensionUri, [
      "sidebar-ui",
      "dist",
      "assets",
      "index.js",
    ]);

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
         <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <script nonce="${nonce}">
              const tsvscode = acquireVsCodeApi();
          </script>
			</head>
      <body>
          <div id="root"></div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}