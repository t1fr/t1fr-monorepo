import axios, { type AxiosRequestConfig, isAxiosError } from "axios";
import type { Serialized } from "../types";

const instance = axios.create({ baseURL: import.meta.env.VITE_BACKEND_API });

class ToastableError {
    constructor(
        public detail: string,
        public summary?: string,
    ) {
    }
}

export function useHttpService() {
    function call<T>(config: AxiosRequestConfig) {
        return new Promise<Serialized<T>>((resolve, reject) => {
            instance
                .request<Serialized<T>>(config)
                .then((value) => resolve(value.data))
                .catch((error) => {
                    if (isAxiosError(error)) {
                        if (error.response) reject(new ToastableError(error.response.data.message, error.response.data.error));
                        reject(new ToastableError(error.message));
                    } else reject(new ToastableError(error));
                });
        });
    }

    function get<T>(url: string, config: AxiosRequestConfig = {}) {
        return call<T>({ method: "GET", url, ...config });
    }

    function patch<T, P = unknown>(url: string, data: P, config: AxiosRequestConfig = {}) {
        return call<T>({ method: "PATCH", url, data, ...config });
    }

    function post<T, P = unknown>(url: string, data: P, config: AxiosRequestConfig = {}) {
        return call<T>({ method: "POST", url, data, ...config });
    }

    function put<T, P = unknown>(url: string, data: P, config: AxiosRequestConfig = {}) {
        return call<T>({ method: "PUT", url, data, ...config });
    }

    function doDelete<T, P = unknown>(url: string, data?: P, config: AxiosRequestConfig = {}) {
        return call<T>({ method: "DELETE", url, data, ...config });
    }

    return { get, patch, post, put, delete: doDelete };
}
