<script setup lang="ts">
import type { PointType } from "@t1fr/backend/member-manage";
import type { Summary } from "../types";
import { PointTypeNameMap } from "../types";

defineProps<{ summary: Summary }>();

const focusType = ref<PointType>("reward");
</script>

<template>
    <TabView>
        <TabPanel header="帳號清單">
            <DataTable :value="summary?.accounts ?? []" show-gridlines>
                <Column field="name" header="遊戲 ID" />
                <Column field="typeLabel" header="帳號類型" />
                <Column field="personalRating" header="個人評分" />
                <Column field="activity" header="活躍度" />
            </DataTable>
        </TabPanel>
        <TabPanel header="點數明細">
            <DataTable id="log-table" :value="summary.point[focusType].logs ?? []" show-gridlines>
                <template #header>
                    <div class="flex justify-content-evenly py-2">
                        <PointMeter point-name="獎勵" @click="focusType = 'reward'" :max="70" :value="summary.point['reward'].total" reverse />
                        <PointMeter point-name="請假" @click="focusType = 'absense'" :max="2" :value="summary.point['absense'].total" />
                        <PointMeter point-name="懲處" @click="focusType = 'penalty'" :max="5" :value="summary.point['penalty'].total" reverse :max-hue="60" />
                    </div>
                    <Divider />
                    <div>{{ PointTypeNameMap[focusType] }}點數明細</div>
                </template>
                <template #empty><h3>沒有變動紀錄</h3></template>
                <Column field="dateLabel" header="日期" class="center w-12rem" />
                <Column field="delta" header="變化" class="center w-6rem">
                    <template #body="{ data, field }">
                        <span v-if="data[field] >= 0" class="text-green-400">{{ data[field] }}</span>
                        <span v-else class="text-red-400">{{ data[field] }}</span>
                    </template>
                </Column>
                <Column field="category" header="類別" class="center w-8rem" />
                <Column field="comment" header="事由" class="center" />
            </DataTable>
        </TabPanel>
    </TabView>
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

