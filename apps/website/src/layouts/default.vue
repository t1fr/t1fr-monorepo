<script setup lang="ts">
import type { RouteRecordRaw } from "vue-router";
import type { MenuItem } from "primevue/menuitem";
import SquadronLogoUrl from "../assets/images/squadron_logo.webp";

const auth = useAuthStore();
const { t } = useI18n();
const toast = useToastService();

const router = useRouter();

if (router.currentRoute.value.name !== "/redirect") {
    auth.verify().then(status => {
        if (!status) auth.startOAuth();
    });
}

onErrorCaptured(error => {
    toast.error({ detail: error });
});

function checkPermission(route: RouteRecordRaw): boolean {
    if (route.meta?.exclude) return false;
    if (!auth.userData) return !(route.meta?.memberOnly ?? route.meta?.officerOnly);
    if (auth.userData.isOfficer) return true;
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
            <Component :is="Component" class="flex-1 w-full min-h-0" />
        </KeepAlive>
    </RouterView>
</template>

<style lang="scss"></style>
