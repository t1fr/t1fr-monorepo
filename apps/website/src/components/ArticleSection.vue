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

$content-percentage: 60%;
$title-percentage: calc(100% - $content-percentage);

section {
    background-color: rgba(28, 28, 28, 0.55);
    display: grid;
    @media screen and (min-width: $lg) {
        grid-template-columns: $title-percentage $content-percentage;
        grid-template-areas:
            "title content"
            "item content";
        &.reverse {
            grid-template-columns: $content-percentage $title-percentage;
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
        @include styleclass("font-semibold flex justify-content-center");
        grid-area: title;
        margin: 1rem 0;
        font-size: 36px;
        letter-spacing: 1rem;
    }

    > div[role="content"] {
        background-color: #00000036;
        grid-area: content;
        @include styleclass("flex p-5 flex-column justify-content-center text-xl gap-2");
    }

    > div[role="item"] {
        grid-area: item;
        @include styleclass("px-3 pb-3");
    }
}
</style>
