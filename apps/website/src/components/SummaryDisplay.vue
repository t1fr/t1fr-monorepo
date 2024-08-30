<script setup lang="ts">
import type { PointType } from "@t1fr/backend/member-manage";
import type { Summary } from "../types";
import { PointTypeNameMap } from "../types";

defineProps<{ summary: Summary }>();

const focusType = ref<PointType>("reward");
</script>

<template>
    <Tabs value="0">
        <TabList>
            <Tab value="0">帳號清單</Tab>
            <Tab value="1">點數明細</Tab>
        </TabList>
        <TabPanels>
            <TabPanel value="0">
                <DataTable :value="summary?.accounts ?? []" show-gridlines>
                    <Column field="name" header="遊戲 ID" class="center" />
                    <Column field="typeLabel" header="帳號類型" class="center" />
                    <Column field="personalRating" header="個人評分" class="center" />
                    <Column field="activity" header="活躍度" class="center" />
                </DataTable>
            </TabPanel>
            <TabPanel value="1">
                <DataTable :value="summary.point[focusType].logs ?? []" show-gridlines>
                    <template #header>
                        <ScrollPanel>
                            <div class="flex justify-evenly py-2 whitespace-nowrap">
                                <PointMeter point-name="獎勵" @click="focusType = 'reward'" :max="70" :value="summary.point['reward'].total" reverse />
                                <PointMeter point-name="請假" @click="focusType = 'absense'" :max="2" :value="summary.point['absense'].total" />
                                <PointMeter
                                    point-name="懲處"
                                    @click="focusType = 'penalty'"
                                    :max="5"
                                    :value="summary.point['penalty'].total"
                                    reverse
                                    :max-hue="60"
                                />
                            </div>
                        </ScrollPanel>
                        <Divider />
                        <div>{{ PointTypeNameMap[focusType] }}點數明細</div>
                    </template>
                    <template #empty><h3>沒有變動紀錄</h3></template>
                    <Column field="dateLabel" header="日期" class="center w-48" />
                    <Column field="delta" header="變化" class="center w-24">
                        <template #body="{ data, field }">
                            <span v-if="data[field] >= 0" class="text-green-400">{{ data[field] }}</span>
                            <span v-else class="text-red-400">{{ data[field] }}</span>
                        </template>
                    </Column>
                    <Column field="category" header="類別" class="center w-32" />
                    <Column field="comment" header="事由" class="center" />
                </DataTable>
            </TabPanel>
        </TabPanels>
    </Tabs>
</template>