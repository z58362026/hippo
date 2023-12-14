/** 添加注释 */
export const addNotesModel =
    '#Function#,给当前的函数整体添加一句话注释，内部逻辑不需要，只输出注释文本，不要输出函数本身';
/** 生成函数 */
export const generateFunction =
    '#Function#,根据当前描述，生成一个函数，只输入函数本身，和函数内部实现逻辑，其他内容都不输出，函数内部使用4个空格隔开的形式。语法使用typescript和es6，去掉markdown，多余的换行干掉，';

export const FunctionModelHandle = (content: string, modelDesc: string) => {
    return modelDesc.replace('#Function#', content);
};
