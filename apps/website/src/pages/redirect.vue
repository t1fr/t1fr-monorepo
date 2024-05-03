<script setup lang="ts">


definePage({ meta: { exclude: true } });

const route = useRoute("/redirect");
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
    if (typeof route.query.code !== "string" || typeof route.query.state !== "string") return;
    const isSuccess = await authStore.login(route.query.code, route.query.state);
    if (isSuccess) router.replace(localStorage.getItem("last-visit") ?? "/");
});
</script>

<template>
    <div class="flex align-items-center">
        <ProgressSpinner style="inset: 0" />
    </div>
</template>

<style scoped></style>
