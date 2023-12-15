// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { createSnippet, saveSnippet } from './command/createSnippet';
import { chatgpt, generateCode, optimizationCode } from './command/chatgpt';

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

    context.subscriptions.push(disposable2, disposable3, disposable4, disposable5, disposable6);
}

// This method is called when your extension is deactivated
export function deactivate() {}
