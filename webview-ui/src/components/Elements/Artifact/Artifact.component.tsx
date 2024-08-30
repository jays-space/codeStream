import {FileResponseType, getArticle} from "@/services";
import {useEffect, useState} from "react";
import {LoaderIcon} from "lucide-react";
import {LinkBreak1Icon} from "@radix-ui/react-icons";
import {ArtifactType, parseCode} from "@/utils";
import Editor from "@uiw/react-codemirror";
import {monokai} from "@uiw/codemirror-theme-monokai";
import {javascript} from "@codemirror/lang-javascript";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkReHype from "remark-rehype";


interface IArtifact {
    path: string;
    owner: string;
    repo: string;
    isLoading: boolean;
}

export const Artifact = ({repo, path, owner, isLoading}: IArtifact) => {
    const [isFetchingArtifact, setIsFetchingArtifact] = useState<boolean>(false);
    const [artifact, setArtifact] = useState<ArtifactType[] | undefined>(undefined)

    useEffect((): void => {
        setIsFetchingArtifact(true);

        const fetchArtifact = async () => {
            try {

                const file: FileResponseType | undefined = await getArticle(owner, repo, path);
                if (!file) return;
                const parsedCode = parseCode(atob(file?.content));
                setArtifact(parsedCode);
            } catch (error) {
                console.error("There was a problem fetching the file", error)
            } finally {
                setIsFetchingArtifact(false);
            }
        }

        fetchArtifact().then((): void => {
        });
    }, [path, repo, owner])

    if (!isLoading && isFetchingArtifact) {
        return <LoaderIcon className="h-6 w-6 text-violet-600"/>;
    }

    if (!artifact) {
        return (
            <div className="flex flex-row items-center justify-center w-full h-full gap-x-2">
                <LinkBreak1Icon className="h-6 w-6 text-white"/>
                <p className="text-white">Something went wrong.</p>
            </div>)
    }

    return (
        <section className="flex flex-col py-2 px-4 w-full max-w-5xl h-full flex-grow items-center justify-center">
            {
                artifact.map(({content, type, index}) => {
                    if (type === "code") {
                        return <code key={index} className='w-full max-w-5xl rounded-md overflow-hidden'>
                            <div className="w-full h-7 bg-gray-700"/>
                            <Editor
                                value={content}
                                extensions={[javascript({jsx: true, typescript: true})]}
                                theme={monokai}
                                readOnly={true}
                                // onChange={onChange}
                                indentWithTab
                                width="100%"
                                basicSetup={{
                                    lineNumbers: true,
                                    highlightActiveLineGutter: true,
                                    foldGutter: false,
                                    dropCursor: true,
                                    allowMultipleSelections: true,
                                    indentOnInput: true,
                                    bracketMatching: true,
                                    closeBrackets: true,
                                    autocompletion: true,
                                    rectangularSelection: true,
                                    crosshairCursor: true,
                                    highlightActiveLine: true,
                                    highlightSelectionMatches: true,
                                    closeBracketsKeymap: true,
                                    searchKeymap: true,
                                    foldKeymap: true,
                                    completionKeymap: true,
                                    lintKeymap: true,
                                    highlightSpecialChars: true,
                                    history: true,
                                    drawSelection: true,
                                    syntaxHighlighting: true,
                                    defaultKeymap: true,
                                    historyKeymap: true,
                                    tabSize: 8,
                                }}
                            />
                        </code>
                    } else {
                        return (
                            <>
                                <div className="w-full h-7 bg-gray-700 rounded-t-md"/>
                                <article key={index}
                                         className="p-8 w-full flex-grow mb-4 rounded-md border border-gray-700 rounded-t-none border-t-0">
                                    <ReactMarkdown className="prose prose-invert w-full"
                                                   remarkPlugins={[remarkGfm, remarkMath]}
                                                   rehypePlugins={[remarkReHype]}>{content}</ReactMarkdown>
                                </article>
                            </>
                        )
                    }
                })
            }

        </section>
    )
}
