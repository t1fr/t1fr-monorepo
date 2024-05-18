import dayjs from "dayjs";

export function formatDate(date: string | Date) {
    return dayjs(date).format("YYYY-MM-DD");
}

export function formatTime(date: string | Date) {
    return dayjs(date).format("YYYY-MM-DD hh:mm:ss");
}

export function dateToUnix(date: string) {
    return dayjs(date).unix().toString();
}

