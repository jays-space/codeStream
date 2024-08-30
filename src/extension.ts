import * as vscode from "vscode";
import { ContentPanel, SidebarProvider } from "./panels";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "codeStream-sidebar",
      sidebarProvider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("codeStream.refresh", async () => {
      ContentPanel.kill();
      ContentPanel.render(context.extensionUri);
      setTimeout(() => {
        vscode.commands.executeCommand(
          "workbench.action.webview.openDeveloperTools"
        );
      }, 500);

      vscode.window.showInformationMessage("refreshed.");
    })
  );

  // Create the show content panel command
  context.subscriptions.push(
    vscode.commands.registerCommand("codeStream.showContent", async () => {
      // vscode.window.showInformationMessage("Showing content");
      ContentPanel.render(context.extensionUri);
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}

// "vscode:prepublish": "npm run package",
// "compile": "webpack",
// "watch": "webpack --watch",
// "package": "webpack --mode production --devtool hidden-source-map",
// "compile-tests": "tsc -p . --outDir out",
// "watch-tests": "tsc -p . -w --outDir out",
// "pretest": "npm run compile-tests && npm run compile && npm run lint",
// "lint": "eslint src --ext ts",
// "test": "vscode-test"
