<script setup lang="ts">
import Toast, { type ToastMessageOptions } from "primevue/toast";

const toast = useToastService();

const toastBus = useEventBus<"error", ToastMessageOptions>("toast");

toastBus.on((event, payload) => {
    if (!payload) return;
    if (event === "error") toast.error(payload);
});

</script>

<template>
    <div id="root" class="w-screen min-w-screen flex flex-column">
        <RouterView />
        <Toast position="bottom-center" style="bottom: 80px;"/>
    </div>
</template>

<style lang="scss">
#root {
    background-color: var(--surface-a);
    height: 100dvh;
    max-height: 100dvh;
    // 在此控管 Scroll Panel 的大小行為，避免同時出現原生卷軸
    .p-scrollpanel {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
}
</style>
