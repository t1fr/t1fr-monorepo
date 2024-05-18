import "primeflex/primeflex.css";
import "primevue/resources/themes/soho-dark/theme.css";
import "./assets/style/_index.scss";

import { MutationCache, QueryCache, QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import PrimeVueZhTwLocale from "primelocale/zh-TW.json";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";

import { createApp } from "vue";
import App from "./App.vue";

import type { ToastMessageOptions } from "primevue/toast";
import i18n from "./i18n";
import router from "./router";


Chart.register(ChartDataLabels);

const app = createApp(App);

const toastBus = useEventBus("toast")

function errorToToast(error: Error): ToastMessageOptions {
    if (error.cause) return { summary: `${error.cause}`, detail: error.message }
    return { detail: error.message }
}

app.directive("tooltip", Tooltip);
app
    .use(VueQueryPlugin, {
        queryClient: new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: Infinity
                }
            },
            queryCache: new QueryCache({
                onError(error) { toastBus.emit("error", errorToToast(error)) }
            }),
            mutationCache: new MutationCache({
                onError(error) { toastBus.emit("error", errorToToast(error)) }
            })
        })
    })
    .use(createPinia())
    .use(router)
    .use(i18n)
    .use(PrimeVue, { locale: PrimeVueZhTwLocale["zh-TW"] })
    .use(ToastService);

app.mount("#app");

