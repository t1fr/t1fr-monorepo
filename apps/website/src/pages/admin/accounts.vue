<script setup lang="ts">
import type { ColumnProps } from "primevue/column";
import type { DataTableCellEditCompleteEvent, DataTableFilterMeta, DataTableProps } from "primevue/datatable";
import type { Account } from "../../types";

const { accounts, mutateAccountOwner, mutateAccountType, isFetching, refetch } = useAccounts();

useF5Key(refetch);

const showNoOwner = ref(false);
const filters = useLocalStorage(
    "accounts.filter",
    {
        hasOwner: { value: [true, false], matchMode: "in" },
        type: { operator: "or", constraints: [{ value: [], matchMode: "in" }] },
    } satisfies DataTableFilterMeta,
    { mergeDefaults: true },
);

watch(showNoOwner, value => {
    filters.value.hasOwner.value = value ? [false] : [true, false];
});

const showChart = ref(false);
const tableProps: DataTableProps = {
    rowHover: true,
    stripedRows: true,
    scrollable: true,
    scrollHeight: "flex",
    editMode: "cell",
    sortMode: "multiple",
    removableSort: true,
    showGridlines: true,
    resizableColumns: true,
    globalFilterFields: ["ownerId"],
    paginator: true,
    rows: 20,
    currentPageReportTemplate: "{first} - {last} / {totalRecords}",
    paginatorTemplate: "CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",
    rowsPerPageOptions: [10, 20, 50, 100, 128],
    filterDisplay: "menu",
    rowClass: (data: Account) => ({ "bg-red-900": !data.hasOwner }),
};

const hideFilter: ColumnProps = {
    showAddButton: false,
    showFilterOperator: false,
    showFilterMatchModes: false,
};

async function save(event: DataTableCellEditCompleteEvent) {
    if (event.value === event.newValue || event.newValue === undefined) return;
    const id = event.data.id;
    if (typeof id !== "string") return;
    if (event.field === "type") mutateAccountType({ id, type: event.newValue });
    else if (event.field === "ownerId") mutateAccountOwner({ id, ownerId: event.newValue });
}
</script>

<template>
    <DataTable v-model:filters="filters" :value="accounts" v-bind="tableProps" @cell-edit-complete="save" :loading="isFetching">
        <template #header>
            <div class="table-header-content">
                <span role="title">隊員帳號清單</span>
                <span class="text-muted-color mr-auto">排序時按 Ctrl 可以進行多級排序</span>
                <Checkbox v-model="showNoOwner" binary />
                <span>僅顯示沒有擁有者的帳號</span>
            </div>
            <Dialog v-model:visible="showChart" modal header="帳號統計" style="width: 550px; height: fit-content" content-class="flex justify-center">
                <PieChart v-if="accounts" field="type" :value="accounts" />
            </Dialog>
        </template>
        <Column field="name" header="遊戲 ID" :sortable="true" class="w-60" />
        <Column field="ownerId" header="擁有者" filter-field="hasOwner">
            <template #body="{ data, field }">
                <MemberSnippet :id="data[field]" />
            </template>
            <template #editor="{ data }">
                <MembersDropdown v-model="data.ownerId" scroll-height="min(50vw, 400px)" />
            </template>
        </Column>
        <Column field="personalRating" header="個人評分" :sortable="true" class="center w-24" />
        <Column field="activity" header="活躍度" :sortable="true" class="center w-24" />
        <Column field="type" filter-field="type" header="帳號類型" class="whitespace-nowrap w-48" v-bind="hideFilter">
            <template #body="{ data }">{{ data.typeLabel }}</template>
            <template #editor="{ data }">
                <AccountTypeSelection class="w-full" v-model="data.type" render-as="dropdown" />
            </template>
            <template #filter="{ filterModel }">
                <AccountTypeSelection v-model="filterModel.value" render-as="listbox" />
            </template>
        </Column>
        <Column field="joinDateLabel" sort-field="joinDateUnix" header="入隊日期" :sortable="true" class="center w-40" />
        <template #paginatorstart>
            <Button label="類型統計" text @click="showChart = true">
                <template #icon>
                    <MdiChartPie class="mr-2" />
                </template>
            </Button>
        </template>
        <template #paginatorend>
            <div style="color: orange" class="flex-1 text-right">※修改前請先向 KCL 或表情確認※</div>
        </template>
    </DataTable>
</template>