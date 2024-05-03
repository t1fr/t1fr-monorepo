<script setup lang="ts">
import type { DataTableCellEditCompleteEvent, DataTableFilterMeta, DataTableProps } from "primevue/datatable";
import type { ColumnProps } from "primevue/column";
import type { Account } from "../../types";
import { FilterMatchMode, FilterOperator, PrimeIcons } from "primevue/api";

const memberStore = useMemberStore();
const { updateAccount } = memberStore;
const { accounts } = storeToRefs(memberStore);
const showNoOwner = ref(false);
const toast = useToastService();

const editingAccounts = ref<Account[]>([]);
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
    paginator: true,
    rows: 20,
    currentPageReportTemplate: "{first} - {last} / {totalRecords}",
    paginatorTemplate: "CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",
    rowsPerPageOptions: [10, 20, 50, 100, 128],
    filterDisplay: "menu",
    rowClass: (data: Account) => ({ "bg-red-900": data.ownerId === null }),
};

const filters = useLocalStorage<DataTableFilterMeta>(
    "accounts.filter",
    { type: { operator: FilterOperator.OR, constraints: [{ value: [], matchMode: FilterMatchMode.IN }] } },
    { mergeDefaults: true },
);

const showChart = ref(false);

async function save(event: DataTableCellEditCompleteEvent) {
    if (event.value === event.newValue || event.newValue === undefined) return;
    const id = event.data.id;
    if (typeof id !== "string") return;
    if (event.field === "type") {
        updateAccount.type(id, event.newValue).then(result => result.mapErr(error => toast.error({ detail: error })));
    } else if (event.field === "ownerId") {
        updateAccount.ownerId(id, event.newValue).then(result => result.mapErr(error => toast.error({ detail: error })));
    }
}

const showAccounts = computed(() => (showNoOwner.value ? accounts.value.filter(value => value.ownerId === null) : accounts.value));

const hideFilter: ColumnProps = {
    showAddButton: false,
    showFilterOperator: false,
    showFilterMatchModes: false,
};

</script>

<template>
    <DataTable  v-model:editing-rows="editingAccounts" v-model:filters="filters" :value="showAccounts" v-bind="tableProps" @cell-edit-complete="save">
        <template #header>
            <div class="flex m-0 align-items-center gap-3">
                <h2 class="m-0 text-white">隊員帳號清單</h2>
                <Button v-tooltip="'類型統計'" text :icon="PrimeIcons.CHART_PIE" @click="showChart = !showChart" />
                <i v-tooltip="'排序時按 Ctrl 可以進行多級排序'" :class="PrimeIcons.INFO_CIRCLE" class="text-xl" />
                <Checkbox v-model="showNoOwner" binary />
                <span>僅顯示沒有擁有者的帳號</span>
                <div style="color: orange" class="flex-1 text-right">※修改前請先向 KCL 或表情確認※</div>
            </div>
            <Dialog v-model:visible="showChart" modal header="帳號統計" style="width: 550px; height: fit-content" content-class="flex justify-content-center">
                <PieChart field="type" :value="accounts" />
            </Dialog>
        </template>
        <Column field="name" header="遊戲 ID" :sortable="true" class="table-fit-content" style="min-width: 14rem" />
        <Column field="ownerId" header="擁有者">
            <template #body="{ data, field }">
                <MemberSnippet :id="data[field]" />
            </template>
            <template #editor="{ data }">
                <MembersDropdown v-model="data.ownerId" scroll-height="min(50vw, 400px)" />
            </template>
        </Column>
        <Column field="personalRating" header="個人評分" :sortable="true" class="table-fit-content text-right" />
        <Column field="activity" header="活躍度" :sortable="true" class="table-fit-content text-right" />
        <Column field="type" filter-field="type" header="帳號類型" class="white-space-nowrap w-12rem" v-bind="hideFilter">
            <template #body="{ data }">{{ data.typeLabel }}</template>
            <template #editor="{ data }">
                <AccountTypeSelection class="w-full" v-model="data.type" render-as="dropdown" />
            </template>
            <template #filter="{ filterModel }">
                <AccountTypeSelection v-model="filterModel.value" render-as="listbox" />
            </template>
        </Column>
        <Column field="joinDateLabel" sort-field="joinDateUnix" header="入隊日期" :sortable="true" class="table-fit-content" />
    </DataTable>
</template>

<style scoped></style>

