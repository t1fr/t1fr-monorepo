import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import { projectRootDir, ProjectType } from '@nx/workspace';
import { resolve } from "path";
import typescript from 'rollup-plugin-typescript2';
import { defineConfig, searchForWorkspaceRoot } from "vite";
import { VitePluginNode } from "vite-plugin-node";
import { viteStaticCopy } from 'vite-plugin-static-copy';

const root = searchForWorkspaceRoot(process.cwd())

export default defineConfig(({ command }) => {
    const outputPath = `dist/${projectRootDir(ProjectType.Application)}/${process.env["NX_TASK_TARGET_PROJECT"]}`;
    return {
        root: __dirname,
        define: {
            __dirname: JSON.stringify(command === "build" ? resolve(root, outputPath) : resolve(__dirname, "src")),
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
                ]
            }),
            command === "build" ? typescript({
                tsconfig: resolve(__dirname, "./tsconfig.app.json"),
            }) : undefined,
            ...VitePluginNode({
                adapter: 'nest',

                appPath: './src/main',

                exportName: 'appServer',

                tsCompiler: 'swc',
                initAppOnBoot: true,
            }),
        ].filter(it => it !== undefined),
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