import "primeflex/primeflex.css";
import "primevue/resources/themes/soho-dark/theme.css";
import "./assets/style/_index.scss";

import { Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import PrimeVueZhTwLocale from "primelocale/zh-TW.json";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";

import { createApp } from "vue";
import App from "./App.vue";

import i18n from "./i18n";
import router from "./router";

Chart.register(ChartDataLabels);

const app = createApp(App);

app.directive("tooltip", Tooltip);
app
    .use(createPinia())
    .use(router)
    .use(i18n)
    .use(PrimeVue, { locale: PrimeVueZhTwLocale["zh-TW"] })
    .use(ToastService);

app.mount("#app");

