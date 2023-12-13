import { RequestOptions } from './axios.d';
import { ContentTypeEnum } from './enum.http';

export function joinTimestamp(join: boolean): object {
    if (!join) {
        return {};
    }
    const now = new Date().getTime();
    return { _t: now };
}

/**
 * 添加content-type语法糖快捷设置。
 */
export function getContentType(options: RequestOptions): ContentTypeEnum {
    if (options.toJson) {
        return ContentTypeEnum.JSON;
    } else if (options.toMulti) {
        return ContentTypeEnum.FORM_DATA;
    } else if (options.toForm) {
        return ContentTypeEnum.FORM_URLENCODED;
    }
    return ContentTypeEnum.FORM_URLENCODED;
}
