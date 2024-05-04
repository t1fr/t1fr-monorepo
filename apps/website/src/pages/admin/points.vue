<script setup lang="ts">
import type { DataTableEmits, DataTableProps } from "primevue/datatable";
import type { ColumnProps } from "primevue/column";
import type { PointType } from "@t1fr/backend/member-manage";

const pointLogStore = usePointLogStore();
const { total, logs } = storeToRefs(pointLogStore);
const currentTotal = computed(() => total.value.get(pointType.value) ?? 0);
const currentLogs = computed(() => logs.value.get(pointType.value) ?? []);
const pointType = useLocalStorage<PointType>("points", "reward");
const focusMemberId = ref<string | null>(null);

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

function load() {
    pointLogStore.load(pointType.value, first.value, rows.value, focusMemberId.value);
}

const listeners: Partial<DataTableEmits> = { page: load };
const first = ref(0);
const rows = ref(20);

const columnProps: ColumnProps = {
    showFilterMatchModes: false,
    showAddButton: false,
    showFilterOperator: false,
};

onMounted(() => load());
</script>

<template>
    <DataTable v-bind="tableProps" v-model:first="first" v-model:rows="rows" :value="currentLogs" :total-records="currentTotal" v-on="listeners">
        <template #header>
            <div class="flex align-items-center gap-3">
                <PointTypeSelection @update:model-value="load" v-model="pointType" />
                <MembersDropdown v-model="focusMemberId" class="w-20rem" @update:model-value="load" show-clear />
                <div class="flex-1" />
            </div>
        </template>
        <Column field="dateLabel" header="日期" class="white-space-nowrap w-8rem" />
        <Column field="memberId" header="對象" class="white-space-nowrap w-15rem" v-bind="columnProps">
            <template #body="{ data, field }">
                <MemberSnippet :id="data[field]" />
            </template>
        </Column>
        <Column field="category" header="分類" class="white-space-nowrap w-8rem" />
        <Column field="delta" header="變化" class="white-space-nowrap text-right w-5rem">
            <template #body="{ data, field }">
                <span v-if="data[field] >= 0" class="text-green-400">{{ data[field] }}</span>
                <span v-else class="text-red-400">{{ data[field] }}</span>
            </template>
        </Column>
        <Column field="comment" header="備註" class="white-space-nowrap" />
    </DataTable>
</template>

<style scoped></style>

