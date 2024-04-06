import {ConfigService} from "@nestjs/config";
import {ParameterMeta} from "./ParameterMeta";
import {CONFIG_CONFIG_SERVICE, CONFIG_CONFIGURABLE, CONFIG_PARAMS} from "./constant";
import {Inject} from "@nestjs/common";


export function Configurable(): MethodDecorator {
    const injectConfigService = Inject(ConfigService);
    return (target, propertyKey, descriptor) => {
        injectConfigService(target, CONFIG_CONFIG_SERVICE);
        // @ts-expect-error this is injected with ConfigService
        const configService: ConfigService = this[CONFIG_CONFIG_SERVICE];
        const originalMethod = descriptor.value;
        // @ts-expect-error adawd
        descriptor.value = function (...args: unknown[]) {
            const paramsMetadata = ((Reflect.getMetadata(CONFIG_PARAMS, target, propertyKey) ?? []) as ParameterMeta[])
                .filter((p) => p.propertyKey === propertyKey);
            for (const param of paramsMetadata) {
                if (!Object.keys(param).includes("configKey")) continue;
                const i = param.parameterIndex;
                // populate undefined argument with the config parameter value
                if (args[i] === undefined) args[param.parameterIndex] = configService.get(param.configKey, param.fallback);
            }
            // Override the original parameter value
            // with the expected property of the value even a deep property.
            // @ts-expect-error adawd
            return originalMethod?.apply(this, args);
        };

        Reflect.defineMetadata(CONFIG_CONFIGURABLE, Reflect.getMetadata(CONFIG_PARAMS, target, propertyKey) ?? [], descriptor.value!);
        return descriptor;
    };
}

