<script setup lang="ts">
import { PrimeIcons } from "primevue/api";

const props = withDefaults(defineProps<{ id: string | null; brief?: boolean; copiable?: boolean }>(), { brief: true, copiable: true });
const { memberMap } = storeToRefs(useMemberStore());
const memberInfo = computed(() => (props.id ? memberMap.value[props.id] : null));
const toastService = useToastService();
const { ctrl, alt } = useMagicKeys();

function onClick(event: Event) {
    if (!props.copiable || !ctrl.value) return;
    event.stopPropagation();
    if (alt.value) {
        window.navigator.clipboard.writeText(props.id!);
        toastService.success({ detail: "已複製（純 ID）" });
    } else {
        window.navigator.clipboard.writeText(`<@${props.id!}>`);
        toastService.success({ detail: "已複製（可標人）" });
    }
}

const tooltip = computed(() => ({
    value: `複製 ${memberInfo.value?.nickname} 的 ID`,
    disabled: !(props.copiable && memberInfo.value && ctrl.value),
}));

const error = ref(false);
</script>

<template>
    <div v-tooltip.top="tooltip" class="flex gap-2 align-items-center clickable" @click="onClick">
        <Avatar shape="circle" :image="memberInfo?.avatar" @error="error = true">
            <template v-if="error" #icon>
                <i :class="PrimeIcons.USER"></i>
            </template>
        </Avatar>
        <span>{{ memberInfo?.nickname ?? "未知" }}</span>
    </div>
</template>

<style scoped></style>

