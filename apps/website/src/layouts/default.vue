<script setup lang="ts">
import type { MenuItem } from "primevue/menuitem";
import type { RouteRecordRaw } from "vue-router";
import SquadronLogoUrl from "../assets/images/squadron_logo.webp";

const { info } = useInfo();
const { t } = useI18n();
const toast = useToastService();

const router = useRouter();

useTitle("T1FR 前線遊騎兵團");

onErrorCaptured(error => {
    toast.error({ detail: error });
});

function checkPermission(route: RouteRecordRaw): boolean {
    if (route.meta?.exclude) return false;
    if (!info.value) return !(route.meta?.memberOnly ?? route.meta?.officerOnly);
    if (info.value.isOfficer) return true;
    return !route.meta?.officerOnly;
}

function mappingRoute(route: RouteRecordRaw): MenuItem {
    const path = route.name?.toString();
    return {
        label: path ? t(`path.${path}`) : path,
        route: path,
        icon: route.meta?.icon,
        items: route.children?.filter(checkPermission).map(subroute => mappingRoute(subroute)),
    };
}
const items = computed<MenuItem[]>(() =>
    router.options.routes
        .flatMap(route => route.children ?? [])
        .sort((a, b) => (a.meta?.order ?? 0) - (b.meta?.order ?? 0))
        .filter(checkPermission)
        .map(route => mappingRoute(route)),
);
</script>

<template>
    <TopNavigationBar :items="items">
        <template #start>
            <Avatar :image="SquadronLogoUrl" class="mx-2" shape="circle" />
        </template>
        <template #end>
            <MemberPanel />
        </template>
    </TopNavigationBar>
    <RouterView v-slot="{ Component }">
        <KeepAlive>
            <div class="flex-1 w-full min-h-0 overflow-y-auto">
                <Component :is="Component" class="h-fit min-h-full" />
            </div>
        </KeepAlive>
    </RouterView>
</template>