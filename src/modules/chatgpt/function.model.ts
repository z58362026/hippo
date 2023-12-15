/** 添加注释 */
export const addNotesModel =
    '#Function#,给当前的函数整体添加一句话注释，需要满足一下条件：1、内部逻辑需要理解，2、只输出注释文本，不要输出函数本身，3、返回中文，4、注释使用//前缀，5、只返回形容词，不返回名词,6、最重要的一点，不要把我的描述文案输出';
/** 生成函数 */
export const generateFunction =
    '#Function#,根据当前描述，生成一个函数，需要满足一下条件：1、只输入函数本身和函数内部实现逻辑，其他内容都不输出，2、函数内部使用4个空格隔开，3、语法使用typescript和es6，4、多余的换行干掉，5、可以单独输出typescript类型，6、输出的类型一定在函数内部或者函数返回使用';
/** 优化代码 */
export const optimizationFunction =
    '#Function#,优化当前代码，需要满足一下条件：1、只返回优化后的函数本身,2、多余的都干掉，3、需要满足当前语法类型需要';

export const FunctionModelHandle = (content: string, modelDesc: string) => {
    return modelDesc.replace('#Function#', content);
};
