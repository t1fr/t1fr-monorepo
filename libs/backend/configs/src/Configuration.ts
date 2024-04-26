import { get, merge } from "lodash";
import { ConfigHelper } from "./ConfigHelper";

export function Configuration(configKey: string, fallback?: unknown): PropertyDecorator {
    return (target, propertyKey) => {
        ConfigHelper.setKey(configKey);
        const propertyType = Reflect.getMetadata("design:type", target, propertyKey);
        Reflect.defineProperty(target, propertyKey, {
            get: () => {
                const value = get(ConfigHelper.Config, configKey);
                switch (propertyType) {
                    case String:
                        return String(value) ?? fallback;
                    case Object:
                        return merge({}, fallback, value);
                    default:
                        return value ?? fallback;
                }
            },
        });
    };
}

