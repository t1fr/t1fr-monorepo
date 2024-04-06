import { NecordModuleOptions } from "necord";
import { ConfigurableModuleOptionsFactory } from "@nestjs/common";

export type NecordOptionsFactory = ConfigurableModuleOptionsFactory<NecordModuleOptions, "createNecordOptions">;
