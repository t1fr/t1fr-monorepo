/// <reference types='vitest' />
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import Vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import AutoImports from "unplugin-auto-import/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import { PrimeVueResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { VueRouterAutoImports } from "unplugin-vue-router";
import VueRouter from "unplugin-vue-router/vite";
import { defineConfig } from "vite";
import Layouts from "vite-plugin-vue-layouts";



export default defineConfig(({ command }) => {
    const BASE_URL = command === "build" && process.env["BASE_URL"]
        ? process.env["BASE_URL"]
        : undefined;
    return {
        root: __dirname,
        base: BASE_URL,
        cacheDir: "../../node_modules/.vite/apps/website",
        server: {
            port: 4200,
            host: "localhost",
        },

        preview: {
            port: 4300,
            host: "localhost",
        },

        plugins: [
            VueRouter({ dts: "./dts/typed-router.d.ts", root: __dirname }),
            Layouts(),
            Vue({ script: { defineModel: true } }),
            Components({ dirs: ["./src/components"], resolvers: [PrimeVueResolver(), IconsResolver({ prefix: "" })], dts: "./dts/components.d.ts" }),
            AutoImports({
                dts: "./dts/auto-imports.d.ts",
                imports: ["vue", "@vueuse/core", "pinia", VueRouterAutoImports, "vue-i18n"],
                dirs: ["./src/composition", "./src/tools", "./src/stores"],
                vueTemplate: true,
            }),
            VueI18nPlugin({ include: resolve(__dirname, "./src/i18n/**") }),
            Icons(),
            nxViteTsPaths(),
        ],

        build: {
            outDir: "../../dist/apps/website",
            reportCompressedSize: true,
            commonjsOptions: {
                transformMixedEsModules: true,
            },
            emptyOutDir: true,
        },

        test: {
            globals: true,
            environment: "jsdom",
            include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
            passWithNoTests: true,
            reporters: ["default"],
            coverage: {
                reportsDirectory: "../../coverage/apps/website",
                provider: "v8",
            },
        },
    }
});
