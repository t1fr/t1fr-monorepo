<script setup lang="ts">
import type { AnchorHTMLAttributes } from "vue";

withDefaults(defineProps<{ href: AnchorHTMLAttributes["href"]; target?: AnchorHTMLAttributes["target"] }>(), { target: "_blank" });
</script>

<template>
    <a class="link-button" :href="href" :target="target" rel="noreferrer noopener">
        <div class="flex items-center justify-center gap-2 w-full h-full">
            <slot name="icon"> </slot>
            <slot />
        </div>
    </a>
</template>

<style scoped lang="scss">
.link-button {
    @apply shadow-lg font-bold px-4 py-2 no-underline;
    border-radius: 5rem;
    transition: background-color 0.3s, color 0.3s;
}
</style>
