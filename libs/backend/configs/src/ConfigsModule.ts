import { DynamicModule, Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ConfigHelper } from "./ConfigHelper";
import { ConfigsModuleOptions } from "./ConfigsModuleOptions";

@Global()
@Module({})
export class ConfigsModule {
    static forRoot(options?: Partial<ConfigsModuleOptions>): DynamicModule {
        const definedOptions = Object.assign({ configDir: "./config" }, options);
        ConfigHelper.loadGlob(definedOptions);
        return {
            module: ConfigsModule,
            imports: [ConfigModule.forRoot({ isGlobal: true, load: [() => ConfigHelper.Config] })],
        };
    }
}

