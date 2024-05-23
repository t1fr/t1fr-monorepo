import dayjs from 'dayjs';
import "dayjs/locale/zh-tw";

import relativeTime from "dayjs/plugin/relativeTime";

dayjs.locale("zh-tw")

dayjs.extend(relativeTime)

export default dayjs