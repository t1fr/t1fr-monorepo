import { onKeyDown } from "@vueuse/core";

export function useF5Key(callback: () => void) {
    onKeyDown("F5", (event) => {
        event.preventDefault();
        callback()
    })
}