<script setup lang="ts">
defineProps<{
    title?: string;
    itemClass?: string;
    contentClass?: string;
    titleClass?: string;
    reverse?: boolean;
}>();
</script>

<template>
    <section class="rounded-2xl bg-content border-surface" :class="{ reverse: reverse }">
        <div role="title" :class="titleClass">
            <slot name="title">
                <span>{{ title }}</span>
            </slot>
        </div>
        <div role="content" :class="contentClass">
            <slot />
        </div>
        <div role="item" :class="itemClass">
            <slot name="item"> </slot>
        </div>
    </section>
</template>

<style scoped lang="scss">
section {
    display: grid;
    overflow: hidden;
    grid-template-columns: 1fr 2fr;
    grid-template-areas:
        "title content"
        "item content";

    &.reverse {
        grid-template-columns: 2fr 1fr;
        grid-template-areas:
            "content title"
            "content item";
    }

    @media screen and (max-width: 640px) {
        grid-template-columns: 100%;
        grid-template-areas:
            "title"
            "content"
            "item";
    }

    > div[role="title"] {
        @apply font-semibold p-4 flex justify-center items-center;
        grid-area: title;
        font-size: 36px;
    }

    > div[role="content"] {
        grid-area: content;
        background-color: #00000036;
        @apply flex flex-col justify-center text-xl gap-2 p-8;
    }

    > div[role="item"] {
        min-width: 0;
        grid-area: item;
    }
}
</style>
