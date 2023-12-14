import * as vscode from 'vscode';
import { genIndex } from '../modules/snippets';
import { apiCreateSnippet, apiSaveSnippet } from '../api/snippet';
export const createSnippet = async (uri: vscode.Uri) => {
    console.log('uri: ', uri);
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    // vscode.window.showInformationMessage('Hello World from hippo!');
    vscode.window.showInformationMessage('Hello World from hippo!');
    const value = await vscode.window.showInputBox({
        ignoreFocusOut: true, // 当焦点移动到编辑器的另一部分或另一个窗口时, 保持输入框打开
        password: false, // 为 true 就表示是密码类型
        prompt: '请输入模版id', // 文本输入提示
        value: '', // 默认值, 默认全部选中
        valueSelection: [6, -1], // 指定选中的范围
    });

    if (!value || !value?.trim()) {
        vscode.window.showErrorMessage('你输入的文本无效');
        return;
    }

    await genIndex(uri.path, value);

    vscode.window.showInformationMessage(`创建成功`);
};

// TODO 后期可以保存到全局
let token = '';
// let token = '3f6Zu9BXj0D44765QsP2pY';
export const saveSnippet = async (uri: vscode.Uri) => {
    if (!token) {
        const value = await vscode.window.showInputBox({
            prompt: '输入你的token',
            placeHolder: 'maker平台的token',
            validateInput: (value) => {
                // 校验输入的值
                return value ? null : 'Token cannot be empty';
            },
        });
        if (!value || !value?.trim()) {
            vscode.window.showErrorMessage('你输入的文本无效');
            return;
        }
        token = value;
    }
    const snippetTitle = await vscode.window.showInputBox({
        prompt: '输入你的title',
        placeHolder: '标题',
        validateInput: (value) => {
            // 校验输入的值
            return value ? null : 'Token cannot be empty';
        },
    });
    if (!snippetTitle || !snippetTitle?.trim()) {
        vscode.window.showErrorMessage('你输入的文本无效');
        return;
    }
    const snippetDesc = await vscode.window.showInputBox({
        prompt: '输入你的desc',
        placeHolder: '标题',
        validateInput: (value) => {
            // 校验输入的值
            return value ? null : 'Token cannot be empty';
        },
    });
    if (!snippetDesc || !snippetDesc?.trim()) {
        vscode.window.showErrorMessage('你输入的文本无效');
        return;
    }
    const contentBuffer = await vscode.workspace.fs.readFile(uri);
    const content = Buffer.from(contentBuffer).toString('utf-8');

    const snippetInfo = await apiCreateSnippet({ snippetTitle, snippetDesc }, token);
    await apiSaveSnippet({ snippetId: snippetInfo.snippetId, content }, token);
    await vscode.env.clipboard.writeText(snippetInfo.snippetId);
    vscode.window.showInformationMessage(`保存成功,已把id复制到剪切板`);
};
