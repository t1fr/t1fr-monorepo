import { onKeyDown } from "@vueuse/core";

export function useRefresh(callback: () => void) {
    onKeyDown("F5", (event) => {
        event.preventDefault();
        callback()
    })
}