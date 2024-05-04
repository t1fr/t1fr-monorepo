<script setup lang="ts">
import type { DropdownProps } from "primevue/dropdown";
import { FilterMatchMode } from "primevue/api";

const id = defineModel<string | null>({ required: true });
const { memberOptions } = storeToRefs(useMemberStore());

const attrs: DropdownProps = {
    filter: true,
    filterMatchMode: FilterMatchMode.CONTAINS,
    filterFields: ["label", "callsign", "id", "value"],
    optionLabel: "callsign",
    optionValue: "value",
};
</script>

<template>
    <Dropdown v-model="id" :options="memberOptions" class="w-full" v-bind="attrs" scroll-height="min(50dvh, 400px)" show-clear>
        <template #value>
            <MemberSnippet :id="id" :copiable="false" />
        </template>
        <template #option="{ option }: { option: { value: string } }">
            <MemberSnippet :id="option.value" :copiable="false" />
        </template>
    </Dropdown>
</template>

<style scoped></style>

