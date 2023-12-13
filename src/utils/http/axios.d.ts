export type ErrorMessageMode = 'none' | 'message' | undefined;

export interface RequestOptions {
    // isPending
    isPending?: boolean;
    // 需要对返回数据进行处理
    isTransformResponse?: boolean;
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    isReturnNativeResponse?: boolean;
    // 默认将prefix 添加到url
    joinPrefix?: boolean;
    // 接口地址
    apiUrl?: string;
    // 请求拼接路径
    urlPrefix?: string;
    // 消息提示类型
    errorMessageMode?: ErrorMessageMode;
    // 是否加入时间戳
    joinTime?: boolean;
    // 忽略重复请求
    ignoreCancelToken?: boolean;
    // 是否携带token
    withZpToken?: boolean;
    // 请求重试机制
    retryRequest?: RetryRequest;
    // 是否自动登录
    autoLogin?: boolean;
    // boss内appId登录场景使用
    appId?: string;
    // 是否显示loading
    isShowLoad?: boolean;
    // 错误的文本信息
    errorMessageText?: string;
    // content-type类型: application/json;charset=UTF-8
    toJson?: boolean;
    // content-type类型: application/x-www-form-urlencoded;charset=UTF-8
    toForm?: boolean;
    // content-type类型: multipart/form-data;charset=UTF-8
    toMulti?: boolean;
    /** 是否提示错误 */
    isShowErrorMessage?: boolean;
}

export interface RetryRequest {
    isOpenRetry: boolean;
    count: number;
    waitTime: number;
}
export interface Result<T = any> {
    code: number;
    message: string;
    zpData: T;
}
