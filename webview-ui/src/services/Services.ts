import {Octokit} from '@octokit/core';

const octokit = new Octokit({
    // auth: 'YOUR_GITHUB_ACCESS_TOKEN',
});

export type RepoFileTypes = "file" | "dir";
export type RepoFileLinkType = {
    git: string;
    html: string;
    self: string;
};

export type RepoFileResponseType = {
    download_url: string;
    git_url: string;
    html_url: string;
    name: string;
    path: string;
    sha: string;
    size: number;
    type: RepoFileTypes;
    url: string;
    _links: RepoFileLinkType;
    isExpanded: boolean
}

export type FileResponseType = Partial<RepoFileResponseType> & {
    content: string;
}

export const fetchRepositoryData = async (owner: string, repo: string, path?: string): Promise<RepoFileResponseType[] | undefined> => {
    let route = `/repos/${owner}/${repo}/contents/`

    if (path) {
        route = path
    }

    try {
        const {data: files}: { data: RepoFileResponseType[] } = await octokit.request(`GET ${route}`);
        return files.map((file) => {
            if (file.type === "dir") {
                return {...file, isExpanded: false}
            } else {
                return {...file}
            }
        });
    } catch (error) {
        console.error('Error fetching repository data:', error);
    }
};

export const fetchProjectInfo = async (owner: string, repo: string): Promise<RepoFileResponseType[] | undefined> => {
    const route = `/repos/${owner}/${repo}/`

    try {
        const {data: repo}: { data: RepoFileResponseType[] } = await octokit.request(`GET ${route}`);
        return repo
    } catch (error) {
        console.error('Error fetching project info:', error);
    }
}
export const fetchArticle = async (owner: string, repo: string): Promise<RepoFileResponseType | undefined | null> => {
    const route = `/repos/${owner}/${repo}/contents/`
    try {
        const {data: files}: { data: RepoFileResponseType[] } = await octokit.request(`GET ${route}`);
        const article = files.find((file) => file.name === "article.md");
        if (article === undefined || article.name === undefined) {
            return null;
        }

        return article;
    } catch (error) {
        console.error('Error fetching article:', error);

    }
}

export const getArticle = async (owner: string, repo: string, path: string): Promise<FileResponseType | undefined> => {
    const route = `/repos/${owner}/${repo}/contents/${path}`;

    try {
        const {data: file}: { data: FileResponseType } = await octokit.request(`GET ${route}`);
        return file;
    } catch (error) {
        console.error('Error fetching project info:', error);
    }
}