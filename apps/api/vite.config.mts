import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import { resolve } from "path";
import typescript from 'rollup-plugin-typescript2';
import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ command }) => {
    const define = command === "build"
        ? { __BUILD__: true }
        : { __BUILD__: false, "import.meta.dirname": JSON.stringify(__dirname) }

    return {
        root: __dirname,
        server: { port: 6518, },
        define,
        legacy: {
            proxySsrExternalModules: true
        },
        build: { emptyOutDir: true, },
        plugins: [
            nxViteTsPaths(),
            viteStaticCopy({
                targets: [
                    { src: "./config", dest: "." },
                    { src: "./.puppeteerrc.cjs", dest: "." },
                ]
            }),
            {
                ...typescript({ tsconfig: resolve(__dirname, "./tsconfig.app.json") }),
                apply: "build"
            },
            ...VitePluginNode({
                adapter: 'nest',

                appPath: './src/main',

                exportName: 'appServer',

                tsCompiler: 'swc'
            }),
        ],
        optimizeDeps: {
            exclude: [
                '@nestjs/microservices',
                '@nestjs/websockets',
                'cache-manager',
                'class-transformer',
                'class-validator',
                'fastify-swagger'
            ],
        },
    }

});