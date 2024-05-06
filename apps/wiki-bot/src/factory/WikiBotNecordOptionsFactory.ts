import { AbstractNecordOptionsFactory, Configuration } from "@t1fr/backend/configs";
import type { NecordModuleOptions } from "necord";

export class WikiBotNecordOptionsFactory extends AbstractNecordOptionsFactory {
    @Configuration("bot")
    protected readonly options!: NecordModuleOptions;
}
