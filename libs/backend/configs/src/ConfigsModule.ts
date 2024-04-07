import { DynamicModule, Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ConfigHelper } from "./ConfigHelper";

@Global()
@Module({})
export class ConfigsModule {
    static forRoot(): DynamicModule {
        ConfigHelper.loadGlob();
        return {
            module: ConfigModule,
            imports: [ConfigModule.forRoot({ isGlobal: true, load: [() => ConfigHelper.Config] })],
        };
    }
}

