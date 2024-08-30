
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {FileSystemItem} from "./FileSystemItem";
import {fetchRepositoryData, RepoFileResponseType} from "@/services";


interface IFileExplorer {
    owner: string;
    repo: string;
    branch: string;
    files?: RepoFileResponseType[] | undefined;
    setFiles?: Dispatch<SetStateAction<RepoFileResponseType[] | undefined>>;
    setCurrentArtifact:  Dispatch<SetStateAction<RepoFileResponseType | undefined>>
}

export const FileExplorer = ({repo, owner, setCurrentArtifact}: IFileExplorer) => {
    const [globalNodes, setGlobalNodes] = useState<RepoFileResponseType[] | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const getNodes = async () => {
            setIsLoading(true);
            try {
                const nodeTree = await fetchRepositoryData(owner, repo);
                setGlobalNodes(nodeTree);
            } catch (error) {
                console.error('Error fetching repo nodes.', error);
            } finally {
                setIsLoading(false);
            }
        }

        getNodes().then(() => {
        });
    }, [owner, repo]);

    useEffect(() => {
    }, [globalNodes])

    return (
        <div className="text-slate-400 text-sm px-4 py-6">
            <h1>Repo Files</h1>
            {
                isLoading &&
                <span>...loading</span>
            }
            <div className="p-0.5 max-w-sm mx-auto">
                <ul>
                    {globalNodes?.map((file: RepoFileResponseType) => {
                        return (
                            <FileSystemItem key={`${file.url}`} node={file} globalNodes={globalNodes}
                                            owner={owner} repo={repo} setGlobalNodes={setGlobalNodes} setCurrentArtifact={setCurrentArtifact} />
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}