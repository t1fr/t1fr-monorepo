<script setup lang="ts">
import Dropdown from "primevue/dropdown";
import { useBattleRatings } from "../useBattleRatings";
import { watchEffect } from "vue";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";

const { battleRatings, isSuccess } = useBattleRatings();

const battleRating = defineModel<string>();

watchEffect(() => {
    if (!isSuccess.value) return;
    battleRating.value = battleRatings.value![0];
});
</script>

<template>
    <InputGroup class="w-10rem">
        <InputGroupAddon class="font-bold">分房</InputGroupAddon>
        <Dropdown v-model="battleRating" :options="battleRatings">
            <template #value="{ value }">
                <div class="flex align-items-center h-full">{{ value }}</div>
            </template>
        </Dropdown>
    </InputGroup>
</template>
