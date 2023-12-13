/**
 * @description: 请求结果映射
 */
export enum ResultEnum {
    SUCCESS = 0,
}

/**
 * @description: 请求方式
 */
export enum RequestEnum {
    GET = 'GET',
    POST = 'POST',
}

/**
 * @description:  contentType
 */
export enum ContentTypeEnum {
    // json
    JSON = 'application/json;charset=UTF-8',
    // form-data qs
    FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
    // form-data  upload
    FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
