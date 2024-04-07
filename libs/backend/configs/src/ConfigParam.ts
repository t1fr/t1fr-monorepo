import { ParameterMeta } from "./ParameterMeta";
import { CONFIG_PARAMS } from "./constant";

export function ConfigParam(configKey: string, fallback?: unknown) {
  const decorator: ParameterDecorator = (target, propertyKey, parameterIndex) => {
    if (propertyKey === undefined) return target;
    const existingParameters: ParameterMeta[] = Reflect.getMetadata(CONFIG_PARAMS, target, propertyKey) ?? [];
    existingParameters.push({ parameterIndex, propertyKey, configKey, fallback });
    Reflect.defineMetadata(CONFIG_PARAMS, existingParameters, target, propertyKey);
    return target;
  };
  return decorator;
}
