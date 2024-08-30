import {Library} from "lucide-react";
import {FileExplorer} from "@/components";
import {Dispatch, SetStateAction} from "react";
import {RepoFileResponseType} from "@/services";

interface IAside {
    owner: string;
    repo: string;
    branch: string
    setCurrentArtifact:  Dispatch<SetStateAction<RepoFileResponseType | undefined>>
}

export const Aside = ({repo, branch, owner, setCurrentArtifact}: IAside) => {
    return (
        <aside className="hidden bg-transparent border-r border-gray-700 md:block sticky">
            <div className="flex h-screen flex-col gap-2">
                <div className="flex items-center border-b border-gray-700 px-4 h-16">
                        <span className="flex items-center gap-2 font-semibold">
                            <Library className="h-6 w-6 text-gray-300"/>
                            <span className="text-gray-300">CodeStream</span>
                        </span>
                    {/*<Button variant="outline" size="icon" className="ml-auto h-8 w-8">*/}
                    {/*    <Bell className="h-4 w-4"/>*/}
                    {/*    <span className="sr-only">Toggle notifications</span>*/}
                    {/*</Button>*/}
                </div>
                {/*<div className="h-full max-h-[calc(100dvh - 3.5rem)]">*/}
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 overflow-auto h-full">
                        <FileExplorer owner={owner} repo={repo} branch={branch} setCurrentArtifact={setCurrentArtifact} />
                    </nav>
                </div>
            </div>
        </aside>
    )
}
