// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged
import vscode from 'vscode';
import { ContentTypeEnum, RequestEnum, ResultEnum } from './enum.http';
import type { AxiosInstance, AxiosResponse } from 'axios';
const { cloneDeep, isString } = require('lodash-es');
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import { VAxios } from './Axios';
import { getContentType, joinTimestamp } from './helper';
import retryRequest from './axiosRetry';
import { RequestOptions, Result } from './axios.d';
import { deepMerge } from '..';

/**
 * @description: 数据处理，方便区分多种处理方式
 */
export const transform: AxiosTransform = {
    /**
     * @description: 处理响应数据。如果数据不是预期格式，可直接抛出错误
     */
    transformResponseHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
        const { isTransformResponse, isReturnNativeResponse, errorMessageText } = options;
        // 是否返回原生响应头 比如：需要获取响应头时使用该属性
        if (isReturnNativeResponse) {
            return res;
        }
        // 错误的时候返回
        const { data } = res;
        if (!data) {
            throw '请求错误';
        }
        // 不进行任何处理，直接返回
        // 用于页面代码可能需要直接获取code，zpData，message这些信息时开启
        if (!isTransformResponse) {
            return res.data;
        }
        //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
        const { code, zpData, message } = data;
        // console.log('message: ', message)
        // 这里逻辑可以根据项目进行修改
        const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS;
        if (hasSuccess) {
            return zpData;
        }
        if (options.isShowErrorMessage) {
            if (options.errorMessageMode === 'message') {
                vscode.window.showErrorMessage(errorMessageText || message || '操作失败！');
            }
        }
        throw '请求错误';
    },
    // 请求之前处理config
    beforeRequestHook: async (config, options) => {
        if (options.isPending && retryRequest.isPendingState()) {
            await new Promise((resolve) => () => retryRequest.setCacheInstances(resolve));
        }
        /**
         * 添加content-type语法糖快捷设置。
         */
        if (options.toForm || options.toJson || options.toMulti) {
            config.headers = { ...config.headers, 'content-type': getContentType(options) };
        }
        const { apiUrl, joinPrefix, joinTime = true, urlPrefix } = options;
        if (joinPrefix) {
            config.url = `${urlPrefix}${config.url}`;
        }
        if (apiUrl && isString(apiUrl)) {
            config.url = `${apiUrl}${config.url}`;
        }
        const params = config.params || {};
        const data = config.data || false;
        if (config.method?.toUpperCase() === RequestEnum.GET) {
            // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
            config.params = Object.assign(params || {}, joinTimestamp(joinTime));
        } else {
            if (
                Reflect.has(config, 'data') &&
                config.data &&
                (Object.keys(config.data).length > 0 || config.data instanceof FormData)
            ) {
                config.data = data;
                config.params = params;
            } else {
                // 非GET请求如果没有提供data，则将params视为data
                config.data = params;
                config.params = undefined;
            }
        }
        return config;
    },
    /**
     * @description: 请求拦截器处理
     */
    requestInterceptors: async (config) => {
        return config;
    },
    /**
     * @description: 响应拦截器处理
     */
    responseInterceptors: async (axiosInstance: AxiosInstance, res: AxiosResponse<any>) => {
        return res;
    },
    /**
     * @description: 响应错误处理
     */
    responseInterceptorsCatch: (axiosInstance: AxiosInstance, error: any) => {
        const { code, message } = error || {};
        const err: string = error?.toString?.() ?? '';
        let errMessage = '';
        if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
            errMessage = '系统服务错误';
        }
        if (err?.includes('Network Error')) {
            errMessage = '网络服务错误';
        }
        if (errMessage) {
            return Promise.reject(error);
        }
    },
};

export function createAxios(opt?: Partial<CreateAxiosOptions>) {
    return new VAxios(
        // 深度合并
        deepMerge(
            {
                timeout: 10 * 1000,
                headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
                // 数据处理方式
                transform: cloneDeep(transform),
                // 配置项，下面的选项都可以在独立的接口请求中覆盖
                requestOptions: {
                    // isPending
                    isPending: true,
                    // 默认将prefix 添加到url
                    joinPrefix: true,
                    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
                    isReturnNativeResponse: false,
                    // 需要对返回数据进行处理
                    isTransformResponse: true,
                    // 消息提示类型
                    errorMessageMode: 'message',
                    // 接口地址
                    apiUrl: '',
                    // 接口拼接地址
                    urlPrefix: '',
                    //  是否加入时间戳
                    joinTime: true,
                    // 忽略重复请求
                    ignoreCancelToken: true,
                    // 是否携带token
                    withZpToken: true,
                    retryRequest: {
                        isOpenRetry: true,
                        count: 3,
                        waitTime: 100,
                    },
                    // 是否自动登录
                    autoLogin: false,
                    // boss内appId登陆使用
                    appId: '',
                    // 是否显示loading
                    isShowLoad: true,
                    // 是否显示失败信息
                    isShowErrorMessage: true,
                    // toJson、toForm、toMulti 三选一
                    // content-type类型: application/json;charset=UTF-8
                    toJson: false,
                    // content-type类型: application/x-www-form-urlencoded;charset=UTF-8
                    toForm: false,
                    // content-type类型: multipart/form-data;charset=UTF-8
                    toMulti: false,
                },
            },
            opt || {}
        )
    );
}

export const http = createAxios();
