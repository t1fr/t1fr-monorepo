import { get } from "lodash";
import { ConfigHelper } from "./ConfigHelper";
import { CONFIG_CONFIGURABLE, CONFIG_PARAMS } from "./constant";
import { ParameterMeta } from "./ParameterMeta";


export function Configurable(): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        const newMethod = function(...args: unknown[]) {
            const paramsMetadata = ((Reflect.getMetadata(CONFIG_PARAMS, target, propertyKey) ?? []) as ParameterMeta[])
                .filter((p) => p.propertyKey === propertyKey);
            for (const param of paramsMetadata) {
                if (!Object.keys(param).includes("configKey")) continue;
                const i = param.parameterIndex;
                // populate undefined argument with the config parameter value
                if (args[i] === undefined) args[param.parameterIndex] = get(ConfigHelper.Config, param.configKey, param.fallback);
            }
            // Override the original parameter value
            // with the expected property of the value even a deep property.
            // @ts-expect-error adawd
            return originalMethod?.apply(this, args);
        };
        // @ts-expect-error adawd
        descriptor.value = newMethod;

        Reflect.defineMetadata(CONFIG_CONFIGURABLE, Reflect.getMetadata(CONFIG_PARAMS, target, propertyKey) ?? [], newMethod);
        return descriptor;
    };
}

