<script setup lang="ts">
import type { TooltipOptions } from "primevue/tooltip";

const props = withDefaults(defineProps<{ id: string | null; brief?: boolean; copiable?: boolean }>(), { brief: true, copiable: true });
const { memberMap } = storeToRefs(useMemberStore());
const memberInfo = computed(() => (props.id ? memberMap.value[props.id] : null));
const toastService = useToastService();
const { ctrl, alt } = useMagicKeys();

const clickable = computed(() => props.copiable && ctrl.value);

function onClick(event: Event) {
    if (!clickable.value) return;
    event.stopPropagation();
    if (alt.value) {
        window.navigator.clipboard.writeText(props.id!);
        toastService.success({ detail: "已複製（純 ID）" });
    } else {
        window.navigator.clipboard.writeText(`<@${props.id!}>`);
        toastService.success({ detail: "已複製（可標人）" });
    }
}

const tooltip = computed<TooltipOptions>(() => ({
    value: `複製 ${memberInfo.value?.nickname} 的 ID`,
    disabled: !(clickable.value && memberInfo.value),
}));

</script>

<template>
    <div v-tooltip.top="tooltip" class="flex gap-2 align-items-center" :class="{ clickable: clickable }" @click="onClick">
        <Avatar shape="circle" :image="memberInfo?.avatar" />
        <span>{{ memberInfo?.nickname ?? "未知" }}</span>
    </div>
</template>

<style scoped></style>

