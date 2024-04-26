import { ConfigurableModuleOptionsFactory, Logger } from "@nestjs/common";
import { Error } from "mongoose";
import { NecordModuleOptions } from "necord";

export abstract class AbstractNecordOptionsFactory implements ConfigurableModuleOptionsFactory<NecordModuleOptions, "createNecordOptions"> {

    protected abstract readonly options: NecordModuleOptions;

    private readonly logger = new Logger(AbstractNecordOptionsFactory.name);

    protected static convertConfig(config: NecordModuleOptions): NecordModuleOptions {
        if (!config.intents) config.intents = [];
        return { ...config, development: ["1046623840710705152"] };
    }

    createNecordOptions(): NecordModuleOptions | Promise<NecordModuleOptions> {
        if (!this.options) throw new Error("Cannot get mongoose options");
        const adjustedOptions = AbstractNecordOptionsFactory.convertConfig(this.options);
        // this.logger.verbose(adjustedOptions);
        return adjustedOptions;
    }
}
