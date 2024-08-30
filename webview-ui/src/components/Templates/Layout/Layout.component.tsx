import {
    Aside, MainContent,
} from "@/components"
import {useState} from "react";
import {RepoFileResponseType} from "@/services";


const owner: string = "jays-space";
const repo: string = "smartenup_test";
const branch: string = "main";

export const Layout = () => {
    const [currentArtifact, setCurrentArtifact] = useState<RepoFileResponseType | undefined>(undefined)
    return (
        <div className="grid bg-[#0E1117] min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] overflow-x-hidden">
            <Aside owner={owner} repo={repo} branch={branch} setCurrentArtifact={setCurrentArtifact}/>
            <main className="flex flex-col">
                {/*<Header/>*/}
                <MainContent owner={owner} repo={repo} branch={branch} artifact={currentArtifact} />
            </main>
        </div>
    )
}
