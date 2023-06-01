import { Injectable } from "@nestjs/common";
import { BooleanOption, Context, NumberOption, Options, RoleOption, SlashCommand, SlashCommandContext, StringOption } from "necord";
import { Role } from "discord.js";

class SetValueOptions {
	@StringOption({
		name: "key",
		description: "設定的鍵，必須已存在",
		required: true,
	})
	key: string;
	@StringOption({
		name: "string",
		description: "字串值",
	})
	stringValue: string;

	@NumberOption({
		name: "number",
		description: "數值",
	})
	numberValue: number;

	@BooleanOption({
		name: "boolean",
		description: "布林值",
	})
	booleanValue: boolean;

	@RoleOption({
		name: "role",
		description: "身分組",
	})
	roleValue: Role;
}

@Injectable()
export class BotConfigCommand {
	@SlashCommand({ name: "set-value", description: "設定新值" })
	async onSetValue(
		@Context() [interaction]: SlashCommandContext,
		@Options() { key, roleValue, stringValue, numberValue, booleanValue }: SetValueOptions,
	) {
		return interaction.reply({
			content: "還未實作",
		});
	}
}
