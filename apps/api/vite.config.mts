import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import generatePackageJson from "rollup-plugin-generate-package-json";
import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { generateLockfile } from "../../libs/rollup-plugins/src/rollup-plugin-generate-lockfile";

export default defineConfig(({ command }) => {
    const define = command === "build"
        ? { __BUILD__: true }
        : { __BUILD__: false, "import.meta.dirname": JSON.stringify(__dirname) }

    return {
        root: __dirname,
        server: { port: 6518, },
        define,
        build: {
            emptyOutDir: true,
            rollupOptions: {
                plugins: [
                    generatePackageJson({
                        baseContents({ dependencies, devDependencies, scripts, ...other }) {
                            return { ...other, name: `@t1fr/${process.env.NX_TASK_TARGET_PROJECT}` };
                        }
                    }),
                    generateLockfile()
                ]
            }
        },
        plugins: [
            nxViteTsPaths(),
            viteStaticCopy({
                targets: [
                    { src: "./config", dest: "." },
                    { src: "./.puppeteerrc.cjs", dest: "." },
                ]
            }),
            ...VitePluginNode({
                adapter: 'nest',
                appPath: './src/main',
                exportName: 'appServer',
                tsCompiler: 'swc',
                initAppOnBoot: true
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