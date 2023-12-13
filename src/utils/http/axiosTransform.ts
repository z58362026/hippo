/**
 * Data processing class, can be configured according to the project
 */
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { RequestOptions, Result } from './axios.d';
import { AxiosRetry } from './axiosRetry';

export interface CreateAxiosOptions extends AxiosRequestConfig {
    authenticationScheme?: string;
    transform?: AxiosTransform;
    requestOptions?: RequestOptions;
}

export abstract class AxiosTransform {
    retryRequest?: AxiosRetry;
    /**
     * @description: 请求之前的配置
     */
    beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => Promise<AxiosRequestConfig>;

    /**
     * @description: 处理响应数据
     */
    transformResponseHook?: (res: AxiosResponse<Result>, options: RequestOptions) => any;

    /**
     * @description: 请求失败处理
     */
    requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>;

    /**
     * @description: 请求之前的拦截器
     */
    requestInterceptors?: (config: AxiosRequestConfig, options: CreateAxiosOptions) => Promise<AxiosRequestConfig>;

    /**
     * @description: 请求之后的拦截器
     */
    responseInterceptors?: (axiosInstance: AxiosInstance, res: AxiosResponse<any>) => Promise<AxiosResponse<any>>;

    /**
     * @description: 请求之前的拦截器错误处理
     */
    requestInterceptorsCatch?: (error: Error) => void;

    /**
     * @description: 请求之后的拦截器错误处理
     */
    responseInterceptorsCatch?: (axiosInstance: AxiosInstance, error: Error) => void;
}
