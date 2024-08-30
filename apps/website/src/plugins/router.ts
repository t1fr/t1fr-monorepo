import type { MemberInfo } from "@t1fr/backend/member-manage";
import { useQueryClient } from "@tanstack/vue-query";
import NProgress from "nprogress";
import 'nprogress/nprogress.css'; // progress bar style
import { setupLayouts } from "virtual:generated-layouts";
import { createRouter, createWebHistory } from "vue-router/auto";

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    extendRoutes: (routes) => setupLayouts(routes),
});


router.beforeEach((to, from) => {
    const meta = to.meta;
    const queryClient = useQueryClient()
    const info = queryClient.getQueryData<MemberInfo>(["info"])
    if (meta.memberOnly && info === undefined) return from;
    if (meta.officerOnly && info?.isOfficer !== true) return from;
});


NProgress.configure({ showSpinner: false })
router.beforeEach(() => { NProgress.start() })
router.afterEach(() => { NProgress.done() })

