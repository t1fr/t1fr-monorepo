import { AbstractNecordOptionsFactory, Configuration } from "@t1fr/backend/configs";
import { NecordModuleOptions } from "necord";

export class WikiBotNecordOptionsFactory extends AbstractNecordOptionsFactory {
    @Configuration("bot", { intents: [] })
    protected readonly options!: NecordModuleOptions;
}
