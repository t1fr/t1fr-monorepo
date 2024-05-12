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
    <section class="border-round-2xl" :class="{ reverse: reverse }">
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
@import "primeflex/primeflex.scss";

section {
    background-color: #1c1c1c8c;

    display: grid;
    overflow: hidden;
    @media screen and (min-width: $lg) {
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
    }

    @media screen and (max-width: $lg) {
        grid-template-columns: 100%;
        grid-template-areas:
            "title"
            "content"
            "item";
    }

    > div[role="title"] {
        @include styleclass("font-semibold p-3 flex justify-content-center align-items-center");
        grid-area: title;
        font-size: 36px;
    }

    > div[role="content"] {
        grid-area: content;
        background-color: #00000036;
        @include styleclass("flex flex-column justify-content-center text-xl gap-2 p-5");
    }

    > div[role="item"] {
        min-width: 0;
        grid-area: item;
    }
}
</style>
