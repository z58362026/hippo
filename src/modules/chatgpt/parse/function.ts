// 省略代码块中的代码，只返回形容词
export const eliminateCodeBlock = (content: string) => {
    return content.replace(/```[^`\n]*\n([\s\S]*?)```/, '$1');
};

// 返回注释文本
export const addCommentIdentifier = (content: string) => {
    if (/^\/\//.test(content)) {
        return content;
    }
    return `// ${content}`;
};
