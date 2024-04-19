import { ConfigurableModuleOptionsFactory } from "@nestjs/common";
import { Error } from "mongoose";
import { NecordModuleOptions } from "necord";

export abstract class AbstractNecordOptionsFactory implements ConfigurableModuleOptionsFactory<NecordModuleOptions, "createNecordOptions"> {
    protected abstract getOptions(options?: NecordModuleOptions): NecordModuleOptions | undefined;


    protected static convertConfig(config: NecordModuleOptions): NecordModuleOptions {
        return {
            ...config,
            intents: [],
            development: ["1046623840710705152"],
        };
    }

    createNecordOptions(): NecordModuleOptions | Promise<NecordModuleOptions> {
        const options = this.getOptions();
        if (!options) throw new Error("Cannot get mongoose options");
        return AbstractNecordOptionsFactory.convertConfig(options);
    }
}
