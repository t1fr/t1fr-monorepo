import { AbstractNecordOptionsFactory, Configuration } from "@t1fr/backend/configs";
import { IntentsBitField } from "discord.js";
import { NecordModuleOptions } from "necord";

export class ManageBotNecordOptionsFactory extends AbstractNecordOptionsFactory {
    @Configuration("bot", {
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildVoiceStates,
            IntentsBitField.Flags.GuildPresences,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent,
        ],
    })
    protected readonly options!: NecordModuleOptions;
}
