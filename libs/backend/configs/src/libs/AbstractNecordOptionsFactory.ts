import { ConfigurableModuleOptionsFactory } from "@nestjs/common";
import { NecordModuleOptions } from "necord";

export abstract class AbstractNecordOptionsFactory implements ConfigurableModuleOptionsFactory<NecordModuleOptions, "createNecordOptions"> {
    protected abstract getOptions(options?: NecordModuleOptions): NecordModuleOptions;

    createNecordOptions(): NecordModuleOptions | Promise<NecordModuleOptions> {
        return this.getOptions();
    }
}
