import { AbstractNecordOptionsFactory, Configuration } from "@t1fr/backend/configs";
import { IntentsBitField } from "discord.js";
import { NecordModuleOptions } from "necord";

export class ManageBotNecordOptionsFactory extends AbstractNecordOptionsFactory {
    @Configuration({
        key: "bot",
        transform: (value: NecordModuleOptions) => {
            value.intents = [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildVoiceStates,
                IntentsBitField.Flags.GuildPresences,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent,
            ];
            return value;
        },
    })
    protected readonly options!: NecordModuleOptions;
}
