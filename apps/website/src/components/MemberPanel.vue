<script setup lang="ts">
const { startOAuth, logout } = useAuth();
const { info } = useInfo();
const router = useRouter();
const isDialogVisible = ref(false);

function onLogoutClick() {
    isDialogVisible.value = true;
}

async function onConfirmLogout() {
    isDialogVisible.value = false;
    await logout();
    const meta = router.currentRoute.value.meta;
    if (meta.officerOnly || meta.memberOnly) router.push("/");
}
</script>

<template>
    <div class="relative flex align-items-center">
        <Dialog v-model:visible="isDialogVisible" modal class="w-25rem" content-class="flex gap-2">
            <template #header>
                <div class="flex align-items-center">
                    <MdiAlert class="mr-3" />
                    <span class="line-height-1">確定要登出嗎</span>
                </div>
            </template>
            <template #default>
                <Button label="否" class="w-full" size="small" outlined @click="isDialogVisible = false" />
                <Button label="是" class="w-full" size="small" severity="danger" @click="onConfirmLogout" />
            </template>
        </Dialog>
        <template v-if="info">
            <span id="callsign" class="text-xl white-space-nowrap font-bold mr-2">{{ info.callsign }}</span>
            <Avatar shape="circle" size="large" :image="info.avatarUrl" />
            <Button label="登出" icon-pos="right" text @click="onLogoutClick">
                <template #icon>
                    <MdiLogout class="mx-2" />
                </template>
            </Button>
        </template>
        <template v-else>
            <Button label="登入" icon-pos="right" text @click="startOAuth()">
                <template #icon>
                    <MdiLogin class="mx-2" />
                </template>
            </Button>
        </template>
    </div>
</template>

<style scoped lang="scss">
#callsign {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
