import { DynamicModule, Global, Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ConfigHelper } from "./ConfigHelper";
import { ConfigsModuleOptions } from "./ConfigsModuleOptions";

@Global()
@Module({})
export class ConfigsModule {

    private static logger = new Logger(ConfigModule.name);

    static forRoot(options?: Partial<ConfigsModuleOptions>): DynamicModule {
        const definedOptions = Object.assign({ configDir: "./config" }, options);
        ConfigHelper.loadGlob(definedOptions);
        if (definedOptions.logging) this.logger.verbose(ConfigHelper.Config);
        return {
            module: ConfigsModule,
            imports: [ConfigModule.forRoot({ isGlobal: true, load: [() => ConfigHelper.Config] })],
        };
    }
}

