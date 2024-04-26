import { applyDecorators, Inject } from "@nestjs/common";
import { ConfigHelper } from "./ConfigHelper";

type ConfigurationOptions = {
    key: string;
    fallback?: unknown,
    transform?: (value: any) => unknown
}

export function Configuration(options: string | ConfigurationOptions): PropertyDecorator {
    const propertyDeco = (() => {
        if (typeof options === "string") ConfigHelper.setKey(options);
        else ConfigHelper.setKey(options.key, options.fallback, options.transform);
    }) satisfies PropertyDecorator;

    const key = typeof options === "string" ? options : options.key;

    return applyDecorators(Inject(`AUTO_CONFIGURATION: ${key}`), propertyDeco);
}

