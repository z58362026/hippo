const { isObject, isNull, isUndefined } = require('lodash-es');

// 深度合并
export function deepMerge<T = any>(origin: any = {}, target: any = {}): T {
    let key: string;
    for (key in target) {
        origin[key] = isObject(origin[key]) ? deepMerge(origin[key], target[key]) : (origin[key] = target[key]);
    }
    return origin;
}

export const isEmptyValue = (value: any) => {
    return (
        isNull(value) ||
        isUndefined(value) ||
        value === '' ||
        JSON.stringify(value) === '{}' ||
        JSON.stringify(value) === '[]'
    );
};
