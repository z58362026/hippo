import { AxiosInstance } from 'axios';
/**
 *  请求重试机制
 */

export class AxiosRetry {
    private cacheAxiosInstance: any[];
    private cacheState: '' | 'pending';
    constructor() {
        this.cacheAxiosInstance = [];
        this.cacheState = '';
    }
    isPendingState() {
        return this.cacheState === 'pending';
    }
    setState(state = 'pending') {
        this.cacheState = state as '' | 'pending';
    }
    setCacheInstances(callback: any) {
        this.cacheAxiosInstance.push(callback);
    }
    continueCacheInstances() {
        this.cacheAxiosInstance.forEach((fn) => fn());
        this.cacheAxiosInstance = [];
        this.cacheState = '';
    }
    /**
     * 重试
     */
    retry(AxiosInstance: AxiosInstance, config: any) {
        const { waitTime, count } = config.requestOptions?.retryRequest || {};
        config.__retryCount = config.__retryCount || 0;
        if (config.__retryCount >= count) {
            return Promise.reject('请求失败');
        }
        config.__retryCount += 1;
        return this.delay(waitTime).then(() => AxiosInstance(config));
    }

    /**
     * 延迟
     */
    private delay(waitTime: number) {
        return new Promise((resolve) => setTimeout(resolve, waitTime));
    }
}

export const createAxiosRetry = () => {
    return new AxiosRetry();
};

export default createAxiosRetry();
