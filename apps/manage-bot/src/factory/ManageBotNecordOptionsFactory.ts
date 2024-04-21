import { AbstractNecordOptionsFactory, ConfigParam, Configurable } from "@t1fr/backend/configs";
import { IntentsBitField } from "discord.js";
import { merge } from "lodash";
import { NecordModuleOptions } from "necord";

export class ManageBotNecordOptionsFactory extends AbstractNecordOptionsFactory {

    private static intents = [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ];

    @Configurable()
    protected getOptions(@ConfigParam("bot") options?: NecordModuleOptions): NecordModuleOptions | undefined {
        return merge(options, { intents: ManageBotNecordOptionsFactory.intents });
    }
}
