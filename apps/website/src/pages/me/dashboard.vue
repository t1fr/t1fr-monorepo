<script setup lang="ts">
const { summary } = useMySummary();
</script>

<template>
    <div class="overflow-y-auto">
        <SummaryDisplay v-if="summary" :summary="summary" />
    </div>
</template>

<style scoped></style>
