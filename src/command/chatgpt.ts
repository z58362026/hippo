import * as vscode from 'vscode';
export const chatgpt = () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        // 获取选中的文本范围
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        // 执行插件内部操作（这里只是简单地在控制台输出）
        console.log('Selected code:', selectedText);
        // 添加注释
        const commentedText = `// Selected code:\n`;
        // 插入到文档中
        editor.edit((editBuilder) => {
            editBuilder.insert(selection.start, commentedText);
        });

        // 移动光标到注释的末尾
        const newPosition = selection.start.translate(commentedText.split('\n').length - 1);
        editor.selection = new vscode.Selection(newPosition, newPosition);

        // 提示用户插入成功
        vscode.window.showInformationMessage('Selected code commented and inserted!');
    }
};
