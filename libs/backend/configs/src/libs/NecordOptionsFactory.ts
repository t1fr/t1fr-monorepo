import { ConfigurableModuleOptionsFactory } from "@nestjs/common";
import { NecordModuleOptions } from "necord";

export interface NecordOptionsFactory extends ConfigurableModuleOptionsFactory<NecordModuleOptions, "createNecordOptions"> {
  createNecordOptions(): NecordModuleOptions | Promise<NecordModuleOptions>;
}
