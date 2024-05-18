export const BackendClient = new AxiosClient({
    baseURL: import.meta.env.VITE_BACKEND_API ?? "http://localhost:6518/api",
    withCredentials: true,
})