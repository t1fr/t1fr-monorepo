<script setup lang="ts">
import type { DropdownProps } from "primevue/dropdown";

defineProps<{ showClear?: boolean }>();

const id = defineModel<string | null>({ required: true });
const { members } = useMembers();
const attrs: DropdownProps = {
    filter: true,
    filterMatchMode: "contains",
    filterFields: ["id", "callsign", "gameId"],
    optionLabel: "callsign",
    optionValue: "id",
};
</script>

<template>
    <Select v-model="id" :options="members" class="w-full" v-bind="attrs" scroll-height="min(50dvh, 400px)" :show-clear="showClear">
        <template #value>
            <MemberSnippet :id="id" :copiable="false" />
        </template>
        <template #option="{ option }: { option: { id: string } }">
            <MemberSnippet :id="option.id" :copiable="false" />
        </template>
    </Select>
</template>
