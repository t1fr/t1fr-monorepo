import { ZodType } from "zod";

export interface ConfigsModuleOptions {
    /**
     * configs directory path: will load all *.config.{yaml,json} and *.[NODE_ENV].config.{yaml,json}
     */
    configDir?: string;
    logging?: boolean;
    watch?: boolean;
    schema?: ZodType
}


