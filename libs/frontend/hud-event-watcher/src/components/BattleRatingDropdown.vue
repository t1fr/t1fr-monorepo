<script setup lang="ts">
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import Select from "primevue/select";
import { watchEffect } from "vue";
import { useBattleRatings } from "../useBattleRatings";

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
        <Select v-model="battleRating" :options="battleRatings">
            <template #value="{ value }">
                <div class="flex align-items-center h-full">{{ value }}</div>
            </template>
        </Select>
    </InputGroup>
</template>
