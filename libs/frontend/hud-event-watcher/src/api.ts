import { AxiosClient } from "@t1fr/frontend/http-client";

export const WarthunderLocalhostClient = new AxiosClient({
    baseURL: "http://localhost:8111"
})

export const BackendClient = new AxiosClient({
    baseURL: import.meta.env.VITE_BACKEND_API ?? "http://localhost:6518/api",
    withCredentials: true,
})