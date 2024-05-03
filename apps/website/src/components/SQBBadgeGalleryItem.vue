<script setup lang="ts">

const props = defineProps<{ year: number; season: number; rank: number }>();
const romanizedSeason = computed(() => romanizeSeason(props.season));
const medalClass = computed(() => findMedalClass(props.rank));
</script>

<template>
    <div class="medal-item">
        <div class="medal" :class="medalClass" :data-year="year" :data-season="romanizedSeason" />
        <div class="mt-2">於 {{ year }} 第 {{ season }} 賽季達到第 {{ rank }} 名</div>
    </div>
</template>

<style scoped>
.medal-item {
    display: flex;
    flex-direction: column;

    align-items: center;
    margin: 0.7rem;
    padding: 1rem;
    font-weight: bold;
}
</style>
