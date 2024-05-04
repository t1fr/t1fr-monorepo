<script setup lang="ts">
import type { DataTableProps, DataTableRowDoubleClickEvent } from "primevue/datatable";
import { FilterMatchMode } from "primevue/api";
import type { Member, Summary } from "../../types";

const memberStore = useMemberStore();
const { members } = storeToRefs(memberStore);
const filters = useLocalStorage<{
    global: { value: boolean | null; matchMode: string };
}>("member.filters", { global: { value: null, matchMode: FilterMatchMode.EQUALS } });

const inspectingMemberSummary = ref<{ member: Member; summary: Summary } | null>(null);

const summaryPanelVisible = computed({
    get() {
        return inspectingMemberSummary.value !== null;
    },
    set(newValue) {
        if (newValue === false) inspectingMemberSummary.value = null;
    },
});

const tableProps: DataTableProps = {
    scrollable: true,
    scrollHeight: "flex",
    editMode: "row",
    sortMode: "single",
    removableSort: true,
    showGridlines: true,
    paginator: true,
    rows: 20,
    size: "small",
    rowsPerPageOptions: [10, 20, 50, 100, 128],
    globalFilterFields: ["noAccount"],
    rowClass: (data: Member) => ({ "bg-red-900": data.noAccount }),
};

async function onDoubleClick(event: DataTableRowDoubleClickEvent) {
    inspectingMemberSummary.value = await memberStore.getSummary(event.data.id).then(summary => ({ member: event.data, summary }));
}
</script>

<template>
    <DataTable v-bind="tableProps" @row-dblclick="onDoubleClick" v-model:filters="filters" :value="members">
        <template #header>
            <div class="flex m-0 align-items-center gap-3 h-3rem">
                <h2 class="m-0 text-white mr-auto">成員清單</h2>
                <Checkbox v-model="filters['global'].value" binary :false-value="null" />
                <span>僅顯示沒有帳號的成員</span>
            </div>
        </template>
        <Column field="isOfficer" class="center w-5rem" header="職位" :sortable="true">
            <template #body="{ data, field }">
                <Tag v-if="data[field]" value="軍官" severity="warning" />
            </template>
        </Column>
        <Column field="id" class="center">
            <template #header>
                <div class="flex justify-content-center w-full">Discord ID</div>
            </template>
            <template #body="{ data, field }">
                <MemberSnippet :id="data[field]" />
            </template>
        </Column>
        <Column field="type" class="w-12rem center" header="類型" :sortable="true">
            <template #body="{ data }">
                <div class="flex align-items-center gap-2 w-fit mx-auto">
                    <MdiCoffee v-if="data.type === 'relaxer'" />
                    <MdiSwordCross v-else />
                    <span>{{ data.typeLabel }}</span>
                </div>
            </template>
        </Column>
        <Column field="isSponsor" class="center w-6rem" header="贊助者" :sortable="true">
            <template #body="{ data, field }">
                <MdiCashUsd v-if="data[field]" class="text-lg vertical-align-middle" />
            </template>
        </Column>
        <Column field="onVacation" class="center w-6rem" header="請假中" :sortable="true">
            <template #body="{ data, field }">
                <MdiCalendarMultiselect v-if="data[field]" class="text-lg vertical-align-middle" />
            </template>
        </Column>
        <Dialog id="summaryPanel" v-model:visible="summaryPanelVisible" maximizable class="summaryPanel" content-class="w-full h-full">
            <template #header>{{ inspectingMemberSummary?.member.callsign }} 的詳細資訊</template>
            <SummaryDisplay :summary="inspectingMemberSummary!.summary" />
        </Dialog>
    </DataTable>
</template>

<style>
.summaryPanel {
    height: 80dvh;
    width: 80dvw;
}
</style>
