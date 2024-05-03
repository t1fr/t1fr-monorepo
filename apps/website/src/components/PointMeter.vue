<script setup lang="ts">
import type { PointType } from "@t1fr/backend/member-manage";
import type { Summary } from "../types";
import { PrimeIcons } from "primevue/api";

const props = withDefaults(
    defineProps<{
        summary?: Summary;
        type: PointType;
        max: number;
        reverse?: boolean;
        minHue?: number;
        maxHue?: number;
    }>(),
    { value: 0, minHue: 0, maxHue: 120, summary: undefined },
);

const model = defineModel<PointType>();

const valueTemplate = (val: number) => `${val}/${props.max}`;

const value = computed(() => props.summary?.points[props.type].sum ?? 0);
const ratio = computed(() => {
    const ratio = Math.min(value.value / props.max, 1);
    return props.reverse ? 1 - ratio : ratio;
});

const meterColor = computed(() => {
    const hue = (props.minHue + (props.maxHue - props.minHue) * ratio.value).toString(10);
    return `hsl(${hue},100%,50%)`;
});
</script>

<template>
    <div class="flex flex-column align-items-center">
        <Knob v-if="ratio < 0" text-color="red" :value-template="valueTemplate" />
        <Knob
            v-else
            :value-template="valueTemplate"
            :model-value="value"
            readonly
            :value-color="meterColor"
            :max="Math.max(value, max)"
            class="pointer-events-none"
        />
        <Button :label="`${type}點明細`" :icon="PrimeIcons.FILE" text link class="shadow-none" @click="model = type" />
    </div>
</template>

<style scoped></style>
