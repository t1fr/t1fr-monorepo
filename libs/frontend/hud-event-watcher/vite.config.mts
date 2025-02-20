import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";

export default defineConfig({
    root: __dirname,
    cacheDir: "../../../node_modules/.vite/libs/frontend/hud-event-watcher",

    plugins: [nxViteTsPaths(), vue()],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },

    test: {
        globals: true,
        passWithNoTests: true,
        environment: "jsdom",
        include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        reporters: ["default"],
        coverage: { reportsDirectory: "../../../coverage/libs/frontend/hud-event-watcher", provider: "v8" },
    },
});
