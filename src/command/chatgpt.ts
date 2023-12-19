import * as vscode from 'vscode';
import { apiChatapiTransform } from '../api/snippet';
import {
    FunctionModelHandle,
    addNotesModel,
    generateFunction,
    optimizationFunction,
    transformText,
} from '../modules/chatgpt';
import { addCommentIdentifier, eliminateCodeBlock } from '../modules/chatgpt/parse';
export const chatgpt = async () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        // 获取选中的文本范围
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        // 执行插件内部操作（这里只是简单地在控制台输出）
        console.log('Selected code:', selectedText);
        const FnTransfrom = transformText(FunctionModelHandle, addNotesModel);

        const content = FnTransfrom(selectedText);
        vscode.window.showInformationMessage('解析中');
        const res = await apiChatapiTransform({ content });
        // 添加注释
        const commentedText = `${addCommentIdentifier(res.data)}\n`;
        // 插入到文档中
        editor.edit((editBuilder) => {
            editBuilder.insert(selection.start, commentedText);
        });

        // 移动光标到注释的末尾
        const newPosition = selection.start.translate(commentedText.split('\n').length - 1);
        editor.selection = new vscode.Selection(newPosition, newPosition);

        // 提示用户插入成功
        vscode.window.showInformationMessage('Selected code commented!');
    }
};
/** 代码优化 */
export const optimizationCode = async () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        // 获取选中的文本范围
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        const FnTransfrom = transformText(FunctionModelHandle, optimizationFunction);

        const content = FnTransfrom(selectedText);
        vscode.window.showInformationMessage('解析中');
        const res = await apiChatapiTransform({ content });
        // 添加注释
        const commentedText = `${res.data}\n`;
        // 插入到文档中
        editor.edit((editBuilder) => {
            editBuilder.insert(selection.end, `\n${eliminateCodeBlock(commentedText)}`);
        });

        // 移动光标到注释的末尾
        const newPosition = selection.start.translate(commentedText.split('\n').length - 1);
        editor.selection = new vscode.Selection(newPosition, newPosition);

        // 提示用户插入成功
        vscode.window.showInformationMessage('Selected code commented!');
    }
};
export const generateCode = async () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        // 获取光标所在位置
        const currentPosition = editor.selection.active;
        // 获取当前行号
        const currentLine = currentPosition.line;

        // 读取当前行的文本
        const currentLineText = editor.document.lineAt(currentLine).text;
        vscode.window.showInformationMessage('解析中');

        const FnTransfrom = transformText(FunctionModelHandle, generateFunction);
        const content = FnTransfrom(currentLineText);

        const res = await apiChatapiTransform({ content });
        // 添加注释
        const conent = `${res.data}\n`;
        // 在下一行插入内容
        const newPosition = new vscode.Position(currentLine + 2, 0);
        editor.edit((editBuilder) => {
            editBuilder.insert(newPosition, eliminateCodeBlock(conent));
        });

        // 将光标移动到插入的位置
        editor.selection = new vscode.Selection(newPosition, newPosition);
    }
};
