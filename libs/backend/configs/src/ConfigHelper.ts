import { Logger } from "@nestjs/common";
import { ConfigObject } from "@nestjs/config";
import { readFileSync } from "fs";
import { globSync } from "glob";
import { load } from "js-yaml";
import { isArray, mergeWith } from "lodash";
import { basename, extname, resolve } from "path";
import { env } from "process";
import { ConfigsModuleOptions } from "./ConfigsModuleOptions";

export class ConfigHelper {
    static Config: ConfigObject = {};
    private static logger = new Logger(ConfigHelper.name);

    private static getFilenames(configDir: string) {
        const configPath = resolve(__dirname, configDir);
        const basePattern = resolve(configPath, "**/+([!.]).config.{json,yaml}").replace(/\\/g, "/");
        const filenames = globSync(basePattern);

        if (env["NODE_ENV"]) {
            const envPattern = resolve(configPath, `**/+([!.]).${env["NODE_ENV"]}.config.{json,yaml}`).replace(/\\/g, "/");
            filenames.push(...globSync(envPattern));
        }

        return filenames;
    }

    private static getConfigKey(filename: string) {
        const extension = extname(filename);
        return basename(filename, extension).split(".")[0];
    }

    private static mergeConfig(current: Record<string, unknown>, append: unknown) {
        return mergeWith(current, append, (a, b) => isArray(b) ? b : undefined);
    }

    static appendConfig(append: Record<string, unknown>) {
        Object.assign(this.Config, append);
    }

    static loadGlob(options: ConfigsModuleOptions) {
        const filenames = this.getFilenames(options.configDir);
        const configs = filenames.reduce((record, filename) => {
            if (options.logging) this.logger.verbose(`載入 ${filename}`);
            const key = this.getConfigKey(filename);
            const content = readFileSync(filename, { encoding: "utf8" });
            const configObject = load(content, { json: true });
            return this.mergeConfig(record, { [key]: configObject });
        }, {});
        Object.assign(this.Config, configs);
    }
}
