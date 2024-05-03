import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import { resolve } from "path";
import typescript from 'rollup-plugin-typescript2';
import { defineConfig, searchForWorkspaceRoot } from "vite";
import { VitePluginNode } from "vite-plugin-node";
import { viteStaticCopy } from 'vite-plugin-static-copy';

const root = searchForWorkspaceRoot(process.cwd())

export default defineConfig(({ command }) => {
    return {
        root: __dirname,
        server: {
            port: 6518,
        },
        // tsconfig: resolve(__dirname, "./tsconfig.app.json")
        define: {
            __dirname: JSON.stringify(command === "build" ? resolve(root, "dist/apps/api") : resolve(__dirname, "src")),
            __BUILD__: command === "build"
        },
        legacy: {
            proxySsrExternalModules: true
        },
        build: {
            emptyOutDir: true
        },
        plugins: [
            nxViteTsPaths(),
            viteStaticCopy({
                targets: [
                    { src: "./src/config", dest: "." },
                    { src: "./.puppeteerrc.cjs", dest: "." },
                ]
            }),
            typescript({
                tsconfig: resolve(__dirname, "./tsconfig.app.json"),
            }),
            ...VitePluginNode({
                adapter: 'nest',

                appPath: './src/main',

                exportName: 'appServer',

                tsCompiler: 'swc',
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