import { DynamicModule, Module } from "@nestjs/common";
import { I18nModule } from "nestjs-i18n";
import { I18nOptions } from "nestjs-i18n/dist/interfaces/i18n-options.interface";
import { AdvancedI18nService } from "./AdvancedI18nService";

@Module({})
export class AdvancedI18nModule {
    static forRoot(options: I18nOptions): DynamicModule {
        const module = I18nModule.forRoot(options);
        module.providers?.push(AdvancedI18nService);
        module.exports?.push(AdvancedI18nService);
        return module;
    }
}
