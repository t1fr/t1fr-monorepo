import { Inject, Injectable } from "@nestjs/common";
import { mapValues } from "lodash";
import { I18nService } from "nestjs-i18n";
import { AdvanceTranslateOptions } from "./AdvanceTranslateOptions";

@Injectable()
export class AdvancedI18nService {
    @Inject()
    private readonly i18nService!: I18nService;

    translate(key: string, options?: AdvanceTranslateOptions) {
        const interpolate = options?.interpolate ?? {};
        const args = options?.args ?? {};
        Object.assign(args, mapValues(interpolate, value => this.i18nService.t(value, options)));
        return this.i18nService.translate<string, string>(key, { ...options, args });
    }

    t(key: string, options?: AdvanceTranslateOptions) {
        return this.translate(key, options);
    }
}