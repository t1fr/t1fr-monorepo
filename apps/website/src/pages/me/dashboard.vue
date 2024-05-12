<script setup lang="ts">
const summaryStore = useSummaryStore();
const { summary } = storeToRefs(summaryStore);

</script>

<template>
    <div class="overflow-y-auto">
        <SummaryDisplay v-if="summary" :summary="summary" />
    </div>
</template>

<style scoped></style>

