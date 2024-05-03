<script setup lang="ts">
import Toast from "primevue/toast";
</script>

<template>
    <div id="root" class="w-screen min-w-screen flex flex-column">
        <RouterView />
        <Toast />
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
