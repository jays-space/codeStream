
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {ChevronDown, ChevronRight, FileIcon, FolderIcon, LoaderCircle} from "lucide-react";
import {fetchRepositoryData, RepoFileResponseType} from "@/services";

interface IFileSystemItem {
    node: RepoFileResponseType;
    globalNodes: RepoFileResponseType[];
    setGlobalNodes: Dispatch<SetStateAction<RepoFileResponseType[] | undefined>>;
    owner: string;
    repo: string;
    branch?: string;
    setCurrentArtifact:  Dispatch<SetStateAction<RepoFileResponseType | undefined>>
}

export const FileSystemItem = ({node, repo, owner, globalNodes, setGlobalNodes, setCurrentArtifact}: IFileSystemItem) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [localNodes, setLocalNodes] = useState<RepoFileResponseType[] | undefined>();

    useEffect(() => {
    }, [localNodes])


    const getLocalNodes = async (owner: string, repo: string, path?: string) => {
        if (localNodes && localNodes?.length > 0 || isLoading) return;

        setIsLoading(true);
        try {
            const nodeTree = await fetchRepositoryData(owner, repo, path);
            if (globalNodes && setLocalNodes) {
                setLocalNodes(nodeTree);
            }

            if (path) {
                const updatedGlobalNode = globalNodes.map(node => {
                    if (node.url === path) {
                        return {...node, ["nodes"]: nodeTree}
                    }
                    return node;
                });
                setGlobalNodes(updatedGlobalNode);
            }

        } catch (error) {
            console.error('Error fetching repo nodes.', error);
        } finally {
            setIsLoading(false);
        }
    }

    const toggleExpansion = async (owner: string, repo: string, payload: RepoFileResponseType) => {
        if (isExpanded) {
            setIsExpanded(false);
            return;
        } else {
            getLocalNodes(owner, repo, payload.url);
            setIsExpanded((value) => !value)
        }
    }

    const selectNode = async (node: RepoFileResponseType) => {
        if(!node) return;
        if(isLoading) return;
        setCurrentArtifact(node);
    }

    return (
        <li>
            {
                node.type === "dir" ? (
                    <div key={node.url}>
                            <span
                                className="flex items-center my-1 p-1 cursor-pointer rounded-md hover:bg-violet-600 hover:text-white transition-colors duration-150"
                                onClick={() => toggleExpansion(owner, repo, node)}>
                                 {isLoading ?
                                     <span><LoaderCircle className="h-4 w-4 mr-1"/></span> : isExpanded ?
                                         <ChevronDown className="h-4 w-4 mr-1"/> :
                                         <ChevronRight className="h-4 w-4 mr-1"/>}
                                <FolderIcon className="h4 w-4 mr-1.5"/> {node.name}
                            </span>

                        {isExpanded &&
                            node.type === "dir" && localNodes && localNodes?.map((folder, index) => {
                                return (
                                    <ul className="pl-4">
                                        <FileSystemItem
                                            key={`${index}-${folder.url}`}
                                            node={folder}
                                            globalNodes={globalNodes}
                                            owner={owner}
                                            repo={repo}
                                            setGlobalNodes={setGlobalNodes}
                                            setCurrentArtifact={setCurrentArtifact}
                                        />
                                    </ul>)
                            })
                        }
                    </div>
                ) : (
                    <span className="flex flex-row gap-x-2 ml-5 my-1 p-1 cursor-pointer rounded-md hover:bg-violet-600 hover:text-white transition-colors duration-150">
                                <FileIcon className="w-4 h-4"/>
                                <span onClick={() => selectNode(node)}>{node.name}</span>
                            </span>
                )
            }
        </li>
    )
}
