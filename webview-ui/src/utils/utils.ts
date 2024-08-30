export type ArtifactType = {
    type: "code" | "note";
    content: string;
    index: number;
}

const removeFirstAsteriskAndSpace = (string: string) => {
    if (!string) return;
    return string.replace(/^\s*\*\s*/, '');
}

const removePublicDecorator = (string: string) => {
    if(!string) return;
    return removeFirstAsteriskAndSpace(string.replace(/^@public\s*\n?/, ''));
};

const removeCommentEnd = (string: string) => {
    if(!string) return;
    return string.replace(/^\*\/\s*\n?/, '');
};

const trim = (string: string) => {
    return string.replace(/^\s+|\s+$/g, '');
};
const split = (string: string) => {
    return string.split(/[\r\n]\s*\*\s+/);
};

const docblockRegex = /\/\*{2}([\s\S]+?)\*\//g;

const docblock = (string: string) => {
    if (!string) return;

    const results = [];
    let match;

    while ((match = docblockRegex.exec(string)) as RegExpExecArray | null) {
        if (!match) continue;

        const result = {
            note: '',
            code: "",
            raw: "",
            lines: [""]
        };

        const lines = split(match?.[1]);
        // Check if the first line has the '@public' decorator
        if (lines.some(line => line.trim().startsWith('@public'))) {
            result.raw = match?.[1]; // Store the raw docblock for later parsing
            result.note = trim(match?.[1]).split('\n').map(removeFirstAsteriskAndSpace).join('\n');
            // Parse the docblock and code
            // result.code = string.substring(match.index + match[0].length).trim(); // Extract the code following the docblock
            result.lines = split(match?.[1]);
            results.push(result);
        }
    }
    return results;
}

export const parseCode = (code: string): ArtifactType[] => {
    const docblocks = docblock(code);
    const result: ArtifactType[] = [];

    let lastIndex = 0;

    docblocks?.forEach(doc => {
        const startIndex = code.indexOf(doc.raw, lastIndex);
        const codeStartIndex = startIndex + doc.raw.length;

        // Add the note to the result
        result.push({
            type: "note",
            content: doc.note.split('\n').map(removePublicDecorator).join('\n'),
            index: startIndex
        });

        // Extract the code block after the docblock
        const nextDocblock = code.substring(codeStartIndex).match(docblockRegex);
        const codeEndIndex = nextDocblock ? codeStartIndex + (nextDocblock?.index ?? 0) : code.length;
        const codeBlock = code.substring(codeStartIndex, codeEndIndex).trim();

        if (codeBlock) {
            result.push({
                type: "code",
                content: codeBlock ? removeCommentEnd(codeBlock) as string : codeBlock,
                index: codeStartIndex
            });
        }

        lastIndex = codeEndIndex;
    });

    // Handle any remaining code after the last docblock
    const remainingCode = code.substring(lastIndex).trim();
    if (remainingCode) {
        result.push({
            type: "code",
            content: remainingCode ? removeCommentEnd(remainingCode) as string : remainingCode,
            index: lastIndex
        });
    }

    return result;
};