<script setup lang="ts">
import { PrimeIcons } from "primevue/api";
import type { AnchorHTMLAttributes } from "vue";

withDefaults(
    defineProps<{
        icon?: typeof PrimeIcons[keyof typeof PrimeIcons];
        href: AnchorHTMLAttributes["href"];
        target?: AnchorHTMLAttributes["target"];
    }>(),
    { target: "_blank" },
);
</script>

<template>
    <a id="link" :href="href" :target="target" class="shadow-4 font-bold px-3 py-2">
        <div class="flex align-items-center justify-content-center gap-2 w-full h-full">
            <span v-if="icon" :class="icon" class="text-4xl" />
            <slot />
        </div>
    </a>
</template>

<style scoped lang="scss">
#link {
    text-decoration: none;
    color: inherit;
    border-radius: 5rem;

    transition: background-color 0.3s,
    color 0.3s;
}

#link:hover {
    background-color: #dddddd !important;
    color: black;
}
</style>
