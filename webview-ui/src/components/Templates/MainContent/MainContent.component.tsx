import {useEffect, useState} from "react";
import {fetchArticle, fetchProjectInfo, RepoFileResponseType} from "@/services";
import {LoaderIcon} from "lucide-react";
import {Article} from "@/components/Elements/Article";
import {Artifact} from "@/components/Elements/Artifact";


interface IMainContentProps {
    owner: string;
    repo: string;
    branch: string;
    artifact?: RepoFileResponseType | undefined;
}

export const MainContent = ({repo, owner, artifact}: IMainContentProps) => {
    const [repository, setRepository] = useState<unknown>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [articleMetadata, setArticleMetadata] = useState<RepoFileResponseType | undefined | null>(undefined)

    useEffect(() => {

        const getProjectDetails = async () => {
            try {
                const data = await fetchProjectInfo(owner, repo);
                setRepository(data);
            } catch (error) {
                console.error('Error fetching project details.', error);
            }
        }

        const getProjectArticle = async () => {
            try {
                const data = await fetchArticle(owner, repo);
                setArticleMetadata(data)
            } catch (error) {
                console.error('Error fetching knowledge article.', error);
            }
        }

        setIsLoading(true);
        getProjectDetails().then(() => {
            getProjectArticle().then(() => {
                setIsLoading(false);
            })
        });

    }, [owner, repo])


    return (
        <section className="min-h-screen flex flex-1 flex-col">
            <div className="flex items-center border-b border-gray-700 px-8 h-16">
                {
                    repository ? (
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        <h1 className="text-lg text-white font-semibold md:text-2xl">{repository?.name}</h1>
                    ) : <LoaderIcon className="h-6 w-6 text-gray-300"/>
                }
            </div>
            <div
                className="flex flex-1 items-center justify-center overflow-x-hidden w-full py-8"
                x-chunk="dashboard-02-chunk-1"
            >
                {
                    artifact && <Artifact repo={repo} owner={owner} path={artifact.path} isLoading={isLoading}/>
                }

                {
                    articleMetadata === null && (
                        <h5 className="text-white">Please an publish article by creating an article.md file in
                            your root repo.</h5>)
                }

                {
                    !artifact && articleMetadata?.path && <Article repo={repo} owner={owner} path={articleMetadata.path} isLoading={isLoading}/>
                }

                {
                    isLoading && <LoaderIcon className="h-6 w-6 text-violet-600"/>
                }
            </div>
        </section>
    )
}
