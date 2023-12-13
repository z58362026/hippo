import type { AxiosRequestConfig, Canceler } from 'axios';
import axios from 'axios';
const { isFunction } = require('lodash-es');

// Used to store the identification and cancellation function of each request
let pendingMap = new Map<string, Canceler>();

export const getPendingUrl = (config: AxiosRequestConfig) => [config.method, config.url].join('&');

export class AxiosCanceler {
    /**
     * 添加请求
     * @param {Object} config
     */
    addPending(config: AxiosRequestConfig) {
        this.removePending(config);
        const url = getPendingUrl(config);
        config.cancelToken =
            config.cancelToken ||
            new axios.CancelToken((cancel) => {
                if (!pendingMap.has(url)) {
                    // 如果没有请求，添加他
                    pendingMap.set(url, cancel);
                }
            });
    }

    /**
     * @description: 清除所有请求
     */
    removeAllPending() {
        pendingMap.forEach((cancel) => {
            cancel && isFunction(cancel) && cancel();
        });
        pendingMap.clear();
    }

    /**
     * 删除请求
     * @param {Object} config
     */
    removePending(config: AxiosRequestConfig) {
        const url = getPendingUrl(config);

        if (pendingMap.has(url)) {
            /**
             * 如果有当前请求，当前请求需要删除
             */
            const cancel = pendingMap.get(url);
            cancel && cancel(url);
            pendingMap.delete(url);
        }
    }

    /**
     * @description: reset
     */
    reset(): void {
        pendingMap = new Map<string, Canceler>();
    }
}
