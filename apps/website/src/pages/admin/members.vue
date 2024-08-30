<script setup lang="ts">
import type { DataTableProps, DataTableRowDoubleClickEvent } from "primevue/datatable";
import type { Member } from "../../types";

const { members, isFetching, refetch } = useMembers();
const inspectMember = ref<Member | null>(null);
const inspectMemberId = computed(() => inspectMember.value?.id ?? null);
const { summary } = useMemberSummary(inspectMemberId);
const filters = useLocalStorage<{ global: { value: boolean | null; matchMode: string } }>("member.filters", {
    global: { value: null, matchMode: "equals" },
});

useF5Key(refetch);

const summaryPanelVisible = computed({
    get: () => inspectMember.value !== null,
    set: newValue => (inspectMember.value = newValue ? inspectMember.value : null),
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
    rowsPerPageOptions: [10, 20, 50, 100, 128],
    globalFilterFields: ["noAccount"],
    rowClass: (data: Member) => ({ "bg-red-900": data.noAccount }),
};

async function onDoubleClick(event: DataTableRowDoubleClickEvent) {
    inspectMember.value = event.data;
}
</script>

<template>
    <DataTable v-bind="tableProps" @row-dblclick="onDoubleClick" v-model:filters="filters" :value="members" :loading="isFetching">
        <template #header>
            <div class="table-header-content">
                <span role="title" class="mr-auto">成員清單</span>
                <Checkbox v-model="filters['global'].value" binary :false-value="null" />
                <span>僅顯示沒有帳號的成員</span>
            </div>
        </template>
        <Column field="isOfficer" class="center w-24" header="職位" :sortable="true">
            <template #body="{ data, field }">
                <Tag v-if="data[field]" value="軍官" severity="warning" />
            </template>
        </Column>
        <Column field="id" class="center">
            <template #header>
                <div class="flex justify-center w-full">Discord ID</div>
            </template>
            <template #body="{ data, field }">
                <MemberSnippet :id="data[field]" />
            </template>
        </Column>
        <Column field="type" class="w-48 center" header="類型" :sortable="true">
            <template #body="{ data }">
                <div class="flex items-center gap-2 w-fit mx-auto">
                    <MdiCoffee v-if="data.type === 'relaxer'" />
                    <MdiSwordCross v-else />
                    <span>{{ data.typeLabel }}</span>
                </div>
            </template>
        </Column>
        <Column field="isSponsor" class="center w-28" header="贊助者" :sortable="true">
            <template #body="{ data, field }">
                <MdiCashUsd v-if="data[field]" class="text-lg align-middle" />
            </template>
        </Column>
        <Column field="onVacation" class="center w-28" header="請假中" :sortable="true">
            <template #body="{ data, field }">
                <MdiCalendarMultiselect v-if="data[field]" class="text-lg align-middle" />
            </template>
        </Column>
        <Dialog id="summaryPanel" v-model:visible="summaryPanelVisible" maximizable class="summaryPanel" content-class="w-full h-full">
            <template #header>{{ inspectMember?.callsign }} 的詳細資訊</template>
            <SummaryDisplay v-if="summary" :summary="summary" />
        </Dialog>
    </DataTable>
</template>

<style>
.summaryPanel {
    height: 80dvh;
    width: 80dvw;
}
</style>
