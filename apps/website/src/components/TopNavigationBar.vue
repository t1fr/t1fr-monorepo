<template>
    <Menubar :model="items">
        <template #start>
            <slot name="start" />
        </template>
        <template #item="{ label, item, props, root, hasSubmenu }">
            <div v-bind="props.action" v-if="hasSubmenu">
                <span v-if="props.icon" v-bind="props.icon" />
                <span v-bind="props.label">{{ label }}</span>
            </div>
            <router-link v-else-if="item.route" v-slot="{ navigate }" :to="item.route" custom>
                <a v-bind="props.action" @click="navigate">
                    <span v-if="props.icon" v-bind="props.icon" />
                    <span v-bind="props.label">{{ label }}</span>
                </a>
            </router-link>
            <a v-else :href="item.url" :target="item.target" v-bind="props.action" rel="nooppener norefferer">
                <span v-if="props.icon" v-bind="props.icon" />
                <span class="mr-2" v-bind="props.label">{{ label }}</span>
                <i v-if="hasSubmenu && root" :class="PrimeIcons.ANGLE_DOWN" />
                <i v-else :class="PrimeIcons.EXTERNAL_LINK" />
            </a>
        </template>
        <template #end>
            <slot name="end" />
        </template>
    </Menubar>
</template>

<script setup lang="ts">
import { PrimeIcons } from "primevue/api";
import type { MenuItem } from "primevue/menuitem";

defineProps<{ items: MenuItem[] }>();
</script>
<style scoped>
:deep(.p-menubar-start) {
    display: flex;
    @media screen and (max-width: 960px) {
        display: none;
    }
}
</style>
