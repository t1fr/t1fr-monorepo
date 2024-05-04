export { }; // needed in .d.ts files
declare module "vue-router" {
    interface RouteMeta {
        exclude?: boolean;
        order?: number;
        icon?: string;
        memberOnly?: boolean;
        officerOnly?: boolean;
    }
}