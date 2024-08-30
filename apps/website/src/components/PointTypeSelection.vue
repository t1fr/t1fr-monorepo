<script setup lang="ts">
import type { PointType } from "@t1fr/backend/member-manage";

const options: { value: PointType; label: string }[] = [
    { value: "reward", label: "獎勵" },
    { value: "absense", label: "請假" },
    { value: "penalty", label: "懲罰" },
];

const pointType = defineModel<PointType>();


</script>

<template>
    <SelectButton :unselectable="false" v-model="pointType" :options="options" option-value="value" option-label="label" class="whitespace-nowrap"/>
</template>
