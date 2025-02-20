<script setup lang="ts">
import type { PointType } from "@t1fr/backend/member-manage";
import type { DataTableProps } from "primevue/datatable";

const pointType = useLocalStorage<PointType>("points", "reward");
const focusMemberId = ref<string | null>(null);
const first = ref(0);
const rows = ref(20);
const params = computed(() => ({ rows: rows.value, skip: first.value, type: pointType.value, memberId: focusMemberId.value }));
const { data, isFetching, refetch } = usePointLogs(params);
useF5Key(refetch);
const tableProps: DataTableProps = {
    scrollable: true,
    scrollHeight: "flex",
    paginator: true,
    rowsPerPageOptions: [10, 20, 50, 100],
    lazy: true,
    rows: 20,
    currentPageReportTemplate: "{first} - {last} / {totalRecords}",
    paginatorTemplate: "CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",
};
</script>

<template>
    <DataTable v-bind="tableProps" :loading="isFetching" v-model:first="first" v-model:rows="rows" :value="data?.logs ?? []" :total-records="data?.total ?? 0">
        <template #header>
            <div class="table-header-content">
                <span role="title" class="mr-auto">點數紀錄</span>
                <PointTypeSelection v-model="pointType" />
                <MembersDropdown v-model="focusMemberId" class="max-w-80" show-clear />
            </div>
        </template>
        <Column field="dateLabel" header="日期" class="center w-48" />
        <Column field="memberId" header="對象" class="w-60">
            <template #body="{ data, field }">
                <MemberSnippet :id="data[field]" />
            </template>
        </Column>
        <Column field="category" header="分類" class="center w-32" />
        <Column field="delta" header="變化" class="center w-20">
            <template #body="{ data, field }">
                <span v-if="data[field] >= 0" class="text-green-400">{{ data[field] }}</span>
                <span v-else class="text-red-400">{{ data[field] }}</span>
            </template>
        </Column>
        <Column field="comment" header="備註" />
    </DataTable>
</template>