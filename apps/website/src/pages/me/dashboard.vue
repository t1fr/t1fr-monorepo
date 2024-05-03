<script setup lang="ts">

const summaryStore = useSummaryStore();
const { summary } = storeToRefs(summaryStore);

onMounted(() => summaryStore.fetch());
</script>

<template>
    <ScrollPanel>
        <SummaryDisplay :summary="summary" />
    </ScrollPanel>
</template>

<style scoped></style>

