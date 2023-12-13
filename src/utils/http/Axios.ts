import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type { RequestOptions, Result } from './axios.d';
import type { CreateAxiosOptions } from './axiosTransform';
import axios from 'axios';
import qs from 'qs';
import { AxiosCanceler } from './axiosCancel';
const { cloneDeep, isFunction } = require('lodash-es');
import { ContentTypeEnum, RequestEnum } from './enum.http';

export * from './axiosTransform';

/**
 * @description:  axios module
 */
export class VAxios {
    private axiosInstance: AxiosInstance;
    private readonly options: CreateAxiosOptions;
    private loadCount: number;

    constructor(options: CreateAxiosOptions) {
        this.loadCount = 0;
        this.options = options;
        this.axiosInstance = axios.create(options);
        this.setupInterceptors();
    }

    // 获取转换方法
    private getTransform() {
        const { transform } = this.options;
        return transform;
    }

    getAxios(): AxiosInstance {
        return this.axiosInstance;
    }

    /**
     * @description:  拦截器配置
     */
    private setupInterceptors() {
        const transform = this.getTransform();
        if (!transform) {
            return;
        }
        const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch } =
            transform;

        const axiosCanceler = new AxiosCanceler();

        // 请求拦截器请求配置
        this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
            return new Promise(async (resolve) => {
                const { ignoreCancelToken } = (config as any).requestOptions;
                const ignoreCancel =
                    ignoreCancelToken !== undefined
                        ? ignoreCancelToken
                        : this.options.requestOptions?.ignoreCancelToken;

                !ignoreCancel && axiosCanceler.addPending(config);

                if (requestInterceptors && isFunction(requestInterceptors)) {
                    config = await requestInterceptors(config, this.options);
                }
                resolve(config as any);
            });
        }, undefined);

        // 请求拦截器请求错误配置
        requestInterceptorsCatch &&
            isFunction(requestInterceptorsCatch) &&
            this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);

        // 请求拦截器响应配置
        this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
            res && axiosCanceler.removePending(res.config);
            return new Promise(async (resolve) => {
                if (responseInterceptors && isFunction(responseInterceptors)) {
                    res = await responseInterceptors(this.axiosInstance, res);
                }
                resolve(res);
            });
            // return res
        }, undefined);

        // 请求拦截器响应错误配置
        responseInterceptorsCatch &&
            isFunction(responseInterceptorsCatch) &&
            this.axiosInstance.interceptors.response.use(undefined, (error) => {
                return responseInterceptorsCatch(this.axiosInstance, error);
            });
    }

    // form-data 数据处理
    supportFormData(config: AxiosRequestConfig) {
        const headers = config.headers || this.options.headers;

        const contentType = headers?.['Content-Type'] || headers?.['content-type'];

        if (
            contentType !== ContentTypeEnum.FORM_URLENCODED ||
            !Reflect.has(config, 'data') ||
            config.method?.toUpperCase() === RequestEnum.GET
        ) {
            return config;
        }

        return {
            ...config,
            data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
        };
    }

    get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        return this.request({ ...config, method: 'GET' }, options);
    }

    post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        return this.request({ ...config, method: 'POST' }, options);
    }

    put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        return this.request({ ...config, method: 'PUT' }, options);
    }

    delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        return this.request({ ...config, method: 'DELETE' }, options);
    }

    async request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        let conf: CreateAxiosOptions = cloneDeep(config);
        const transform = this.getTransform();

        const { requestOptions } = this.options;

        const opt: RequestOptions = Object.assign({}, requestOptions, options);

        const { beforeRequestHook, requestCatchHook, transformResponseHook } = transform || {};
        if (beforeRequestHook && isFunction(beforeRequestHook)) {
            conf = await beforeRequestHook(conf, opt);
        }
        conf.requestOptions = opt;

        conf = this.supportFormData(conf);

        return new Promise((resolve, reject) => {
            this.axiosInstance
                .request<any, AxiosResponse<Result>>(conf)
                .then((res: AxiosResponse<Result>) => {
                    if (transformResponseHook && isFunction(transformResponseHook)) {
                        try {
                            const ret = transformResponseHook(res, opt);
                            resolve(ret);
                        } catch (err) {
                            reject(err || new Error('请求错误'));
                        }
                        return;
                    }
                    resolve(res as unknown as Promise<T>);
                })
                .catch((e: Error | AxiosError) => {
                    if (requestCatchHook && isFunction(requestCatchHook)) {
                        reject(requestCatchHook(e, opt));
                        return;
                    }
                    if (axios.isAxiosError(e)) {
                        // rewrite error message from axios in here
                    }
                    reject(e);
                })
                .finally(() => {});
        });
    }
}
