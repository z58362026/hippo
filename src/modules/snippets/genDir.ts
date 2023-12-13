import * as vscode from 'vscode';
import { readdir, writeFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { getSnippetDetail } from '../../api/snippet';
import { pinyin, convert } from 'pinyin-pro';

const indexFileExt = '.code-snippets';

export async function genIndex(dir: string, snippetId: string) {
    const res = await getSnippetDetail({ snippetId });

    // 得到目录下所有文件名集合
    const result = await promisify(readdir)(dir);

    const indexFileName = convert(pinyin(res.snippetTitle), { format: 'toneNone' }).replace(/\s/g, '');

    vscode.window
        .showInputBox({
            ignoreFocusOut: true, // 当焦点移动到编辑器的另一部分或另一个窗口时, 保持输入框打开
            password: false, // 为 true 就表示是密码类型
            prompt: '请输入文件名', // 文本输入提示
            value: indexFileName, // 默认值, 默认全部选中
            valueSelection: [6, -1], // 指定选中的范围
        })
        .then((value) => {
            if (!value || !value?.trim()) {
                vscode.window.showErrorMessage('你输入的文本无效');
                return;
            }
            if (result.some((n) => n === value + indexFileExt)) {
                vscode.window.showErrorMessage(`重复文件名称`);
                return;
            }
            // 生成聚合导出代码
            const content = `
                ${res.content}
            `;
            // 写入文件夹下
            return promisify(writeFile)(join(dir, indexFileName + indexFileExt), content);
        });
}
