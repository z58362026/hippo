// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { createSnippet, saveSnippet } from './command/createSnippet';
import { chatgpt, generateCode, optimizationCode } from './command/chatgpt';
import { ChatWebview } from './modules/chatgpt/navbar/searchText';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "hippo" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json

    const disposable2 = vscode.commands.registerCommand('snippet.create', (uri: vscode.Uri) => {
        createSnippet(uri);
    });
    const disposable3 = vscode.commands.registerCommand('snippet.save', (uri: vscode.Uri) => {
        saveSnippet(uri);
    });
    const disposable4 = vscode.commands.registerCommand('chatgpt.comment', () => {
        chatgpt();
    });
    const disposable5 = vscode.commands.registerCommand('chatgpt.generate', () => {
        generateCode();
    });
    const disposable6 = vscode.commands.registerCommand('chatgpt.optimization', () => {
        optimizationCode();
    });

    const chatWebview = new ChatWebview();
    vscode.window.registerWebviewViewProvider('Chat-sidebar', chatWebview, {
        webviewOptions: {
            // 这是一个比较有用的配置项，可以确保你的插件在不可见时不会被销毁，建议开启，否侧每次打开都会重新加载一次插件
            // retainContextWhenHidden: true,
        },
    });
    // 这里实现了一个简单的功能，在vscode打开的文件中，选中代码时会实时展示在web页面上
    // 监听用户选中文本事件
    vscode.window.onDidChangeTextEditorSelection((event) => {
        const editor = event.textEditor;
        let document = editor.document;
        let selection = editor.selection;
        // 获取当前窗口的文本
        let text = document.getText(selection);
        // 上文提到chatWebview可能为null 因此需要可选链写法，所以这里存在不稳定性，不过测试没问题~
        chatWebview?.webview?.webview.postMessage({
            // 第一次postMessage，下一次在chatWebview文件的iframe中
            command: 'vscodeSendMesToWeb',
            data: text,
        });
    });

    const disposable7 = vscode.commands.registerCommand('chatgpt.refresh', () => {
        chatWebview?.webview?.webview.postMessage({
            // 第一次postMessage，下一次在chatWebview文件的iframe中
            command: 'refreshIframe',
        });
    });

    context.subscriptions.push(disposable2, disposable3, disposable4, disposable5, disposable6, disposable7);
}

// This method is called when your extension is deactivated
export function deactivate() {}
