<script setup lang="ts">
definePage({ meta: { exclude: true } });

const route = useRoute("/redirect");
const router = useRouter();
const { login } = useAuth();
const toast = useToastService();

onMounted(async () => {
    const code = route.query.code as string | undefined;
    const state = route.query.state as string | undefined;
    const error = route.query.error as string | undefined;
    const error_description = route.query.error_description as string | undefined;

    if (error || !code || !state) toast.error(error_description ?? "授權錯誤");
    else await login(code, state);
    router.replace(localStorage.getItem("last-visit") ?? "/");
});
</script>

<template>
    <div class="flex items-center">
        <ProgressSpinner style="inset: 0" />
    </div>
</template>