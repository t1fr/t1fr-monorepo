import "./assets/style/_index.scss";

import { createApp } from "vue";
import App from "./App.vue";

import { DayJsPlugin, i18n, PrimeVuePlugin, router, TanstackQuery } from "./plugins";

const app = createApp(App);

app
    .use(TanstackQuery)
    .use(createPinia())
    .use(PrimeVuePlugin)
    .use(router)
    .use(i18n)
    .use(DayJsPlugin)
    .mount("#app");

