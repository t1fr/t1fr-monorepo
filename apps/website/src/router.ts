import { setupLayouts } from "virtual:generated-layouts";
import { createRouter, createWebHistory } from "vue-router/auto";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    extendRoutes: (routes) => setupLayouts(routes),
});

router.beforeEach((to, from) => {
    const { userData } = useAuthStore();
    const meta = to.meta;
    if (userData) {
        // login
        if (meta.officerOnly && !userData.isOfficer) return from;
    } else {
        // not login
        if (meta.officerOnly || meta.memberOnly) return from;
    }
});

export default router;