<script setup lang="ts">
import type { DataTableProps, DataTableRowExpandEvent } from "primevue/datatable";
import { FilterMatchMode, PrimeIcons } from "primevue/api";
import type { Member } from "../../types";
import type { PointType } from "@t1fr/backend/member-manage";

const memberStore = useMemberStore();
const { members, summaries } = storeToRefs(memberStore);
const filters = useLocalStorage<{
    global: { value: boolean | null; matchMode: string };
}>("member.filters", { global: { value: null, matchMode: FilterMatchMode.EQUALS } });

const PointTypes: Array<{ field: PointType; header: string }> = [
    { field: "reward", header: "獎勵" },
    { field: "absense", header: "請假" },
    { field: "penalty", header: "懲處" },
];

const tableProps: DataTableProps = {
    scrollable: true,
    scrollHeight: "flex",
    editMode: "row",
    sortMode: "single",
    removableSort: true,
    showGridlines: true,
    resizableColumns: true,
    paginator: true,
    rows: 20,
    rowsPerPageOptions: [10, 20, 50, 100, 128],
    filterDisplay: "menu",
    globalFilterFields: ["noAccount"],
    rowClass: (data: Member) => ({ "bg-red-900": data.noAccount }),
};

const expandedRows = ref();

function onRowExpand(event: DataTableRowExpandEvent) {
    // @ts-ignore docs says event.data is any, but the d.ts is any[]
    memberStore.loadSummary(event.data._id);
}
</script>

<template>
    <DataTable v-bind="tableProps" v-model:expanded-rows="expandedRows" v-model:filters="filters" :value="members" size="small" @row-expand="onRowExpand">
        <template #header>
            <div class="flex m-0 align-items-center gap-3 h-3rem">
                <h2 class="m-0 text-white flex-1">成員清單</h2>
                <Checkbox v-model="filters['global'].value" binary :false-value="null" />
                <span>僅顯示沒有帳號的成員</span>
            </div>
        </template>
        <Column field="isOfficer" class="text-center" style="min-width: 5rem" header="職位" header-class="flex justify-content-center" :sortable="true">
            <template #body="{ data, field }">
                <Tag v-if="data[field]" value="軍官" severity="warning" />
            </template>
        </Column>
        <Column field="id" class="text-center w-full">
            <template #header>
                <div class="flex justify-content-center w-full">Discord ID</div>
            </template>
            <template #body="{ data, field }">
                <MemberSnippet :id="data[field]" />
            </template>
        </Column>
        <Column v-for="pointType in PointTypes" :key="pointType.field" :field="pointType.field" :sortable="true" :header="pointType.header" >
            <template #body="{ data, field }">
                <div class="text-center">{{ data[field] }}</div>
            </template>
        </Column>
        <Column expander class="text-center" style="min-width: 4rem">
            <template #rowtogglericon="{ rowExpanded }">
                <i :class="rowExpanded ? PrimeIcons.ANGLE_DOWN : PrimeIcons.ANGLE_LEFT" />
            </template>
        </Column>
        <template #expansion="{ data }">
            <SummaryDisplay :summary="summaries[data._id]" />
        </template>
    </DataTable>
</template>

<style scoped></style>
