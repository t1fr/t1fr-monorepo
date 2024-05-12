<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { MenuItem } from "primevue/menuitem";

const router = useRouter();
function onClick(item: MenuItem) {
    if (item.route) {
        if (!item.items || item.items.length === 0) router.push(item.route);
    }
}

defineProps<{ items: MenuItem[] }>();
</script>

<template>
    <Menubar :model="items" class="navbar">
        <template #start>
            <slot name="start" />
        </template>
        <template #item="{ label, item, props, hasSubmenu }">
            <div v-bind="props.action" @click="onClick(item)" :class="{ 'active': $route.matched.some(it => it.path === item.route) }">
                <Icon v-if="item.icon" :icon="item.icon" v-bind="props.icon" />
                <span v-bind="props.label">{{ label }}</span>
                <Icon v-if="hasSubmenu" icon="mdi-chevron-down" v-bind="props.submenuicon" />
            </div>
        </template>
        <template #end>
            <slot name="end" />
        </template>
    </Menubar>
</template>

<style scoped>


</style>
