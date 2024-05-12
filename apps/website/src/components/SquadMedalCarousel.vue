<script setup lang="ts">
import type { CarouselProps } from "primevue/carousel";

const achievements = ref(squadronBattleAchievements);

const config: CarouselProps = {
    showIndicators: false,
    numScroll: 1,
};

const container = ref();

const { width } = useElementSize(container);
const buttonWidth = 96;
const numVisible = computed(() => Math.max(Math.floor((width.value - buttonWidth) / 420), 1));
const flexBasis = computed(() => `${100 / numVisible.value}%`);
</script>

<template>
    <Carousel ref="container" :numVisible="numVisible" v-bind="config" :value="achievements">
        <template #item="{ data }">
            <SQBBadgeGalleryItem v-bind="data" />
        </template>
    </Carousel>
</template>

<style scoped lang="scss">
:deep(.p-carousel-item) {
    width: 100%;
    flex: 1 0 v-bind(flexBasis) !important;
}
</style>
