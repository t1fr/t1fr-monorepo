<script setup lang="ts" generic="T extends 'dropdown' | 'listbox'">
import type { AccountType } from "@t1fr/backend/member-manage";

defineProps<{ renderAs: T }>();

type ModelType = T extends "dropdown" ? AccountType | null : AccountType[];

const type = defineModel<ModelType>();

const options: Array<{ value: AccountType | null; label: string }> = [
    { value: "sqb_main", label: "S 聯隊戰主帳" },
    { value: "relax_main", label: "N 休閒主帳" },
    { value: "private_alt", label: "A 個人小帳" },
    { value: "public_main", label: "C 公用主帳" },
    { value: "public_alt", label: "B 公用小帳" },
    { value: "semipublic_main", label: "D 半公用主帳" },
];

const withNull = options.concat({ value: null, label: "沒有指定" });
</script>

<template>
    <Dropdown v-if="renderAs === 'dropdown'" v-model="type" :options="options" option-value="value" option-label="label" scroll-height="min(50dvh, 400px)" />
    <Listbox v-else v-model="type" :options="withNull" option-value="value" option-label="label" multiple />
</template>
