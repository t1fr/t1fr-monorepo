import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import type { Plugin } from "vue";
const toastBus = useEventBus("toast")

export const TanstackQuery: Plugin = {
    install(app) {
        app.use(VueQueryPlugin, {
            queryClient: new QueryClient({
                defaultOptions: {
                    queries: { staleTime: Infinity },
                    mutations: { onError(error) { toastBus.emit("error", error) } }
                }
            })
        })
    },
}