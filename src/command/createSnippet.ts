import * as vscode from 'vscode';
import { genIndex } from '../modules/snippets';
export const createSnippet = (uri: vscode.Uri) => {
    console.log('uri: ', uri);
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    // vscode.window.showInformationMessage('Hello World from hippo!');
    vscode.window.showInformationMessage('Hello World from hippo!');
    vscode.window
        .showInputBox({
            ignoreFocusOut: true, // 当焦点移动到编辑器的另一部分或另一个窗口时, 保持输入框打开
            password: false, // 为 true 就表示是密码类型
            prompt: '请输入模版id', // 文本输入提示
            value: '', // 默认值, 默认全部选中
            valueSelection: [6, -1], // 指定选中的范围
        })
        .then((value) => {
            if (!value || !value?.trim()) {
                vscode.window.showErrorMessage('你输入的文本无效');
                return;
            }
            return genIndex(uri.path, value);
        })
        .then(() => {
            vscode.window.showInformationMessage(`创建成功`);
        });
};
