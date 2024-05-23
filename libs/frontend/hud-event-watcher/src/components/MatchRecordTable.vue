<script setup lang="ts">
import DataTable, { type DataTableProps } from "primevue/datatable";
import Column from "primevue/column";
import BattleRatingDropdown from "./BattleRatingDropdown.vue";
import { ref } from "vue";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import { useMatchRecords } from "../useMatchRecords";
import { computed } from "vue";
import { debouncedRef } from "@vueuse/core";

const battleRating = ref<string>();
const enemyName = ref<string>();
const ourName = ref<string>("T1FR");
const params = computed(() => ({ br: battleRating.value, enemyName: enemyName.value, ourName: ourName.value }));
const debouncedParam = debouncedRef(params, 1000);
const fields = new Array(8).fill(0).map((_, index) => `enemy${index + 1}`);

const { records, isFetching, refetch, formatedUpdatedTimeAgo, isPending } = useMatchRecords(debouncedParam);

const config: DataTableProps = {
    scrollable: true,
    scrollHeight: "flex",
    showGridlines: true,
    rowClass(data) {
        const isVictory = data.isVictory as boolean | unknown;
        if (isVictory === undefined) return;
        else if (isVictory) return "bg-green-900";
        else return "bg-red-900";
    },
};
</script>

<template>
    <DataTable table-class="no-header" :value="records" v-bind="config" :loading="isFetching">
        <template #empty>
            <div class="flex justify-content-center">沒有紀錄</div>
        </template>
        <template #header>
            <div class="flex gap-2 align-items-center">
                <BattleRatingDropdown v-model="battleRating" />
                <InputGroup class="w-25rem">
                    <InputGroupAddon class="font-bold">我方名稱</InputGroupAddon>
                    <InputText :maxlength="5" v-model="ourName"></InputText>
                    <InputGroupAddon class="font-bold">敵方名稱</InputGroupAddon>
                    <InputText :maxlength="5" v-model="enemyName"></InputText>
                </InputGroup>
                <Button text rounded class="mr-auto" @click="refetch()">
                    <template #icon>
                        <MdiMagnify class="mx-2" />
                    </template>
                </Button>
                <span v-if="!isPending">上次更新於：{{ formatedUpdatedTimeAgo }}</span>
            </div>
        </template>
        <Column v-for="field in fields" :field="field" :key="field" class="center w-8rem" />
    </DataTable>
</template>

<style scoped lang="scss">
:deep(.no-header) {
    thead {
        display: none;
    }
    .p-datatable-emptymessage td {
        border-width: 1px !important;
    }
}
</style>
