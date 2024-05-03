import dayjs from "dayjs";

function formatDate(date: string | Date) {
    return dayjs(date).format("YYYY-MM-DD");
}

function formatTime(date: string | Date) {
    return dayjs(date).format("YYYY-MM-DD hh:mm:ss");
}

function dateToUnix(date: string) {
    return dayjs(date).unix().toString();
}


export const Formatter = { formatDate, formatTime, dateToUnix }