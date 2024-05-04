import { DynamicModule, Global, Logger, Module, Provider } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { existsSync, readFileSync } from "fs";
import { load } from "js-yaml";
import { get, isArray, merge, mergeWith } from "lodash-es";
import { Error } from "mongoose";
import * as path from "node:path";
import { resolve } from "path";
import { env } from "process";
import { z } from "zod";
import { ConfigHelper } from "./ConfigHelper";
import { ConfigsModuleOptions } from "./ConfigsModuleOptions";


@Global()
@Module({})
export class ConfigsModule {

    private static logger: Logger | undefined;

    static forRoot(options?: Partial<ConfigsModuleOptions>): DynamicModule {
        const normalizeOptions = this.normalizeOptions(options);
        if (normalizeOptions.logging) this.logger = new Logger(ConfigModule.name);
        ConfigHelper.Config = this.getRawConfig(normalizeOptions.configDir, normalizeOptions.watch);
        this.logger?.log(ConfigHelper.Config);
        normalizeOptions.schema.parse(ConfigHelper.Config);
        const providers = ConfigHelper.getKeys().map<Provider>(it => {
            let value = get(ConfigHelper.Config, it.key);
            if (value === undefined && it.fallback === undefined) throw new Error(`Key: ${it.key} 沒有定義，且未提供預設值`);
            if (value === undefined) value = it.fallback;
            if (it.transform) value = it.transform(value);

            return { provide: `AUTO_CONFIGURATION: ${it.key}`, useValue: value };
        });

        return {
            module: ConfigsModule,
            imports: [ConfigModule.forRoot({ isGlobal: true, load: [() => ConfigHelper.Config] })],
            providers: providers,
            exports: providers,
        };
    }

    private static normalizeOptions(options: Partial<ConfigsModuleOptions> | undefined) {
        const defaultOptions: Required<ConfigsModuleOptions> = {
            configDir: "./config",
            logging: false,
            watch: false,
            schema: z.any(),
        };

        const normalize = options ? merge(defaultOptions, options) : defaultOptions;

        normalize.configDir = resolve(__dirname, normalize.configDir);

        return normalize;
    }

    private static getFilenames(configDir: string) {
        const extension = ["yml", "yaml", "json"];
        const filenames = extension.map(it => path.join(configDir, `application.${it}`));
        const environment = env["NODE_ENV"];
        if (environment) filenames.push(...extension.map(it => path.join(configDir, `application.${environment}.${it}`)));
        return filenames;
    }

    private static getRawConfig(configDir: string, watch: boolean) {
        const filenames = this.getFilenames(configDir);
        return filenames.reduce((accumulate, filename) => {
            if (!existsSync(filename)) return accumulate;
            this.logger?.verbose(`載入 ${filename}`);
            const content = readFileSync(filename, { encoding: "utf8" });
            const config = load(content, { json: true });
            return mergeWith(accumulate, config, (a, b) => isArray(b) ? b : undefined);
        }, {});
    }
}

