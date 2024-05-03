<script setup lang="ts">
import type { DataTableProps } from "primevue/datatable";
import type { ColumnProps } from "primevue/column";
import type { PointType } from "@t1fr/backend/member-manage";

const pointLogStore = usePointLogStore();

const tableProps: DataTableProps = {
    scrollable: true,
    scrollHeight: "flex",
    paginator: true,
    rowsPerPageOptions: [10, 20, 50, 100],
    lazy: true,
    rows: 20,
    filterDisplay: "menu",
};

const PointTypes: { value: PointType; label: string }[] = [
    { value: "reward", label: "獎勵" },
    { value: "absense", label: "請假" },
    { value: "penalty", label: "懲罰" },
];

const { filters, total, logs, delta } = storeToRefs(pointLogStore);
const { load } = pointLogStore;
const listeners = { page: load, filter: load, sort: load };
onMounted(async () => {
    await nextTick();
    await load();
});

const columnProps: ColumnProps = {
    showFilterMatchModes: false,
    showAddButton: false,
    showFilterOperator: false,
};
</script>

<template>
    <DataTable v-model:filters="filters" v-bind="tableProps" :value="logs" :total-records="total" v-on="listeners">
        <template #header>
            <div class="flex align-items-center gap-3">
                <SelectButton v-model="pointLogStore.pointType" :options="PointTypes" option-value="value" option-label="label" />
                <div class="flex-1" />
            </div>
        </template>
        <Column field="date" header="日期" class="white-space-nowrap w-8rem" />
        <Column field="member" header="對象" class="white-space-nowrap w-15rem" v-bind="columnProps">
            <template #filter="{ filterModel }">
                <MembersDropdown v-model="filterModel.value" />
            </template>
            <template #body="{ data, field }">
                <MemberSnippet :id="data[field]" />
            </template>
        </Column>
        <Column field="category" header="分類" class="white-space-nowrap w-8rem" />
        <Column field="delta" header="變化" class="white-space-nowrap text-right w-5rem" :footer="`${delta}`">
            <template #body="{ data, field }">
                <span v-if="data[field] >= 0" class="text-green-400">{{ data[field] }}</span>
                <span v-else class="text-red-400">{{ data[field] }}</span>
            </template>
        </Column>
        <Column field="comment" header="備註" class="white-space-nowrap" />
    </DataTable>
</template>

<style scoped></style>

