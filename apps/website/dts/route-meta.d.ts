import type { PrimeIconsOptions } from "primevue/api";

declare module "vue-router" {
    interface RouteMeta {
        exclude?: boolean;
        group?: boolean;
        order?: number;
        icon?: keyof PrimeIconsOptions;
        memberOnly?: boolean;
        officerOnly?: boolean;
    }
}