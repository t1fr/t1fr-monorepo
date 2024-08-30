<script setup lang="ts" generic="T extends 'dropdown' | 'listbox'">
import type { AccountType } from "@t1fr/backend/member-manage";

defineProps<{ renderAs: T }>();

type ModelType = T extends "dropdown" ? AccountType | null : AccountType[];
const type = defineModel<ModelType>();

</script>

<template>
    <Select
        v-if="renderAs === 'dropdown'"
        v-model="type"
        :options="AccountTypeOptions"
        option-value="value"
        option-label="label"
        scroll-height="min(50dvh, 400px)"
    />
    <Listbox v-else v-model="type" :options="AccountTypeOptionsWithNull" option-value="value" option-label="label" multiple />
</template>
