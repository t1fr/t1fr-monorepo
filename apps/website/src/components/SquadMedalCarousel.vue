<script setup lang="ts">
import type { CarouselProps } from "primevue/carousel";

const achievements = ref(squadronBattleAchievements);

const config: CarouselProps = {
    numVisible: 4,
    numScroll: 1,
    responsiveOptions: [
        { breakpoint: "1328px", numVisible: 3, numScroll: 1 },
        { breakpoint: "1039px", numVisible: 2, numScroll: 1 },
        { breakpoint: "767px", numVisible: 1, numScroll: 1 },
    ],
    showIndicators: false,
};
</script>

<template>
    <Carousel v-bind="config" :value="achievements">
        <template #item="{ data }">
            <SQBBadgeGalleryItem v-bind="data" />
        </template>
    </Carousel>
</template>

<style scoped lang="scss">
:deep(.p-carousel-item) {
    width: 100%;
}
</style>
