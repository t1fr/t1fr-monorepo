<script setup lang="ts">
const authStore = useAuthStore();
const router = useRouter();
const { userData } = storeToRefs(authStore);
const isDialogVisible = ref(false);

function onLogoutClick() {
    isDialogVisible.value = true;
}

async function logout() {
    isDialogVisible.value = false;
    await authStore.logout();
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
                <Button label="是" class="w-full" size="small" severity="danger" @click="logout" />
            </template>
        </Dialog>
        <template v-if="userData">
            <span id="callsign" class="text-xl white-space-nowrap font-bold mr-2">{{ userData.callsign }}</span>
            <Avatar shape="circle" size="large" :image="userData.avatarUrl" />
            <Button label="登出" icon-pos="right" text @click="onLogoutClick">
                <template #icon>
                    <MdiLogout class="mx-2" />
                </template>
            </Button>
        </template>
        <template v-else>
            <Button label="登入" icon-pos="right" text @click="authStore.startOAuth()">
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
