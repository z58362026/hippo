export const eliminateCodeBlock = (content: string) => {
    return content.replace(/```[^`\n]*\n([\s\S]*?)```/, '$1');
};
