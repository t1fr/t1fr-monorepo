import { createProjectGraphAsync, detectPackageManager, readCachedProjectGraph, readJsonFile } from "@nx/devkit";
import { createLockFile, getLockFileName } from "@nx/js";
import { writeFileSync } from "fs";
import type { Plugin } from "rollup";

export function generateLockfile(): Plugin {
    return {
        name: 'generate-lockfile', // this name will show up in logs and errors
        async generateBundle(outputOptions) {
            const pm = detectPackageManager();
            const projectGraph = readCachedProjectGraph() ?? (await createProjectGraphAsync());
            const outputDir = outputOptions.dir;
            const packageJson = readJsonFile(`${outputDir}/package.json`);

            const lockFile = createLockFile(packageJson, projectGraph, pm);

            const lockFileName = getLockFileName(pm);
            console.log("hahah")
            writeFileSync(`${outputDir}/${lockFileName}`, lockFile, { encoding: "utf8" });
        },
    };
}