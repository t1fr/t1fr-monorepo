<script setup lang="ts">
import Toast, { type ToastMessageOptions } from "primevue/toast";

const toast = useToastService();

const toastBus = useEventBus<"error", ToastMessageOptions>("toast");

function errorToToast(error: Error): ToastMessageOptions {
    if (error.cause) return { summary: `${error.cause}`, detail: error.message };
    return { detail: error.message };
}

toastBus.on((event, payload) => {
    if (!payload) return;
    if (event !== "error") return;
    toast.error(payload instanceof Error ? errorToToast(payload) : payload);
});
</script>

<template>
    <div id="root" class="w-screen min-w-[100vw] flex flex-col h-dvh">
        <RouterView />
        <Toast position="bottom-center" style="bottom: 80px" />
    </div>
</template>
