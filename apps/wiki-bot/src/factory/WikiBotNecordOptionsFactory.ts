import { ConfigParam, Configurable, NecordOptionsFactory } from "@t1fr/backend/configs";
import { NecordModuleOptions } from "necord";
import { IntentsBitField } from "discord.js";

export class WikiBotNecordOptionsFactory implements NecordOptionsFactory {

  @Configurable()
  getToken(@ConfigParam("bot.token") token?: string) {
    return token;
  }


  createNecordOptions(): Promise<NecordModuleOptions> | NecordModuleOptions {
    const token = this.getToken();
    return {
      token: token,
      intents: [IntentsBitField.Flags.Guilds],
      development: ["1046623840710705152"],
    };
  }
}
