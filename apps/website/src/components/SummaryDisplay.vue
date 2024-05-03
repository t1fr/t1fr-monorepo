<script setup lang="ts">
import type { PointType } from "@t1fr/backend/member-manage";
import type { Summary } from "../types";

const props = defineProps<{ summary?: Summary }>();

const focusType = ref<PointType>("reward");
</script>

<template>
    <div class="flex lg:flex-row flex-column align-items-stretch gap-1 min-h-full h-fit" style="min-width: fit-content">
        <DataTable class="flex-1" :value="summary?.accounts ?? []" show-gridlines>
            <template #header>
                <span class="text-2xl">帳號清單</span>
            </template>
            <Column field="name" header="遊戲 ID" />
            <Column field="type" header="帳號類型" />
            <Column field="personalRating" header="個人評分" />
            <Column field="activity" header="活躍度" />
        </DataTable>
        <DataTable id="log-table" class="flex-1" :value="summary?.points[focusType]?.logs ?? []" show-gridlines>
            <template #header>
                <span class="text-2xl">點數明細</span>
                <Divider />
                <div class="flex justify-content-evenly py-2">
                    <PointMeter v-model="focusType" :max="70" type="reward" :summary="summary" reverse />
                    <PointMeter v-model="focusType" :max="2" type="absense" :summary="summary" />
                    <PointMeter v-model="focusType" :max="5" type="penalty" :summary="summary" reverse :max-hue="60" />
                </div>
                <Divider />
                <div>{{ focusType }}點數明細</div>
            </template>
            <template #empty><h3>沒有變動紀錄</h3></template>
            <Column field="date" header="日期" />
            <Column field="delta" header="變化">
                <template #body="{ data, field }">
                    <span v-if="data[field] >= 0" class="text-green-400">{{ data[field] }}</span>
                    <span v-else class="text-red-400">{{ data[field] }}</span>
                </template>
            </Column>
            <Column field="category" header="類別" />
            <Column field="detail" header="事由" />
        </DataTable>
    </div>
</template>

<style scoped lang="scss">
#log-table {
    :deep(.p-datatable-header) {
        padding: 1rem 0;

        > span,
        div {
            padding: 0 1rem;
        }
    }
}
</style>

