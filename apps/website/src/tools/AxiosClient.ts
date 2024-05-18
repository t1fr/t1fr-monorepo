import type { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults, } from "axios";
import axios, { isAxiosError } from "axios";
import type { Serialized } from "../types";


export class AxiosClient {

    private readonly instance: AxiosInstance;

    constructor(config?: CreateAxiosDefaults) {
        this.instance = axios.create(config)
    }

    private async call<T>(config: AxiosRequestConfig) {
        return this.instance
            .request<Serialized<T>>(config)
            .then((value) => value.data)
            .catch((error) => {
                if (isAxiosError(error)) {
                    if (error.response) throw new Error(error.response.data.message, { cause: error.response.data.error });
                    else if (error.request) throw new Error(error.request);
                }
                throw new Error(error.message);
            });
    }

    get<TResponse>(url: string, config: AxiosRequestConfig = {}) {
        return this.call<TResponse>({ method: "GET", url, ...config });
    }

    patch<TResponse, TData = unknown>(url: string, data?: TData, config: AxiosRequestConfig = {}) {
        return this.call<TResponse>({ method: "PATCH", url, data, ...config });
    }

    post<TResponse, TData = unknown>(url: string, data?: TData, config: AxiosRequestConfig = {}) {
        return this.call<TResponse>({ method: "POST", url, data, ...config });
    }

    put<TResponse, TData = unknown>(url: string, data?: TData, config: AxiosRequestConfig = {}) {
        return this.call<TResponse>({ method: "PUT", url, data, ...config });
    }

    delete<TResponse, TData = unknown>(url: string, data?: TData, config: AxiosRequestConfig = {}) {
        return this.call<TResponse>({ method: "DELETE", url, data, ...config });
    }
}
