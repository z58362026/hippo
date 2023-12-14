import * as vscode from 'vscode';
import { genIndex } from '../modules/snippets';
export const createSnippet = (uri: vscode.Uri) => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    // vscode.window.showInformationMessage('Hello World from hippo!');
    // 获取当前编辑器
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        // 获取选中的文本范围
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        // 执行插件内部操作（这里只是简单地在控制台输出）
        console.log('Selected code:', selectedText);
        vscode.window.showInformationMessage('Selected code processed! Check the console.');
    }
};
