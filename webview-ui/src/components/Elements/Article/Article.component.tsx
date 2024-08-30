import {FileResponseType, getArticle} from "@/services";
import ReactMarkdown from 'react-markdown'
import {LoaderIcon} from "lucide-react";
import {useEffect, useState} from "react";
import {LinkBreak1Icon} from "@radix-ui/react-icons";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkReHype from "remark-rehype";

interface IArticleProps {
    path: string;
    owner: string;
    repo: string;
    isLoading: boolean;
}

export const Article = ({path, repo, owner, isLoading}: IArticleProps)  => {
    const [isFetchingArticle, setIsFetchingArticle] = useState<boolean>(false);
    const [article, setArticle] = useState<string | undefined>(undefined)

    useEffect((): void => {
        setIsFetchingArticle(true);

        const fetchArticle = async () => {
            try {

                const file: FileResponseType | undefined = await getArticle(owner, repo, path);
                if (!file) return;
                const decodedFile = atob(file?.content);
                setArticle((decodedFile))
            } catch (error) {
                console.error(error)
            } finally {
                setIsFetchingArticle(false);
            }
        }

        fetchArticle().then((): void => {
        });
    }, [path, repo, owner])

    if (!isLoading && isFetchingArticle) {
        return <LoaderIcon className="h-6 w-6 text-violet-600"/>;
    }

    if (!article) {
        return (
            <div className="flex flex-row items-center justify-center w-full h-full">
                <LinkBreak1Icon className="h-6 w-6 text-white"/>
                <p>Something went wrong.</p>
            </div>)
    }

    return (
        <article className="flex py-2 px-4 w-full max-w-5xl h-full flex-grow items-center justify-center">
            <ReactMarkdown className="prose prose-invert" remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[remarkReHype]}>{article}</ReactMarkdown>
        </article>
    )
}
