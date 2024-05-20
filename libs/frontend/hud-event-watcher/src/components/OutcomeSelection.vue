<script setup lang="ts">
import SelectButton, { type SelectButtonProps } from "primevue/selectbutton";

const outcomeButtonConfig: SelectButtonProps = {
    options: [
        { label: "勝利", class: "win", value: true },
        { label: "失敗", class: "lose", value: false },
    ],
    allowEmpty: false,
    optionLabel: "label",
    optionValue: "value",
};

const isVictory = defineModel<boolean | undefined>();
</script>

<template>
    <SelectButton v-bind="outcomeButtonConfig" v-model="isVictory">
        <template #option="{ option }">
            <span :class="option.class">{{ option.label }}</span>
        </template>
    </SelectButton>
</template>

<style scoped lang="scss">
@import "primeflex/primeflex.scss";

.p-selectbutton {
    > .p-button {
        &[aria-checked="false"] {
            > span {
                &.lose {
                    @include styleclass("text-red-400");
                }
                &.win {
                    @include styleclass("text-green-400");
                }
            }
        }
    }
}
</style>
