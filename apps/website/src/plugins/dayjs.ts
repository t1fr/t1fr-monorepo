import dayjs from 'dayjs';
import "dayjs/locale/zh-tw";
import relativeTime from "dayjs/plugin/relativeTime";

import type { Plugin } from 'vue';

export const DayJsPlugin: Plugin = {
    install() {
        dayjs.locale("zh-tw")
        dayjs.extend(relativeTime)
    },
}

