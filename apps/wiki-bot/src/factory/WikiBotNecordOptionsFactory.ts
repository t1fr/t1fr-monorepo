import { AbstractNecordOptionsFactory, ConfigParam, Configurable } from "@t1fr/backend/configs";
import { NecordModuleOptions } from "necord";

export class WikiBotNecordOptionsFactory extends AbstractNecordOptionsFactory {

    @Configurable()
    protected getOptions(@ConfigParam("bot") options?: NecordModuleOptions): NecordModuleOptions {
        return {
            ...options,
            intents: [],
            development: ["1046623840710705152"],
        };
    }
}
