import { AutocompleteInterceptor } from "necord";
import { Injectable, Logger } from "@nestjs/common";
import { AccountRepo } from "@/modules/squadron/account/account.repo";
import { MemberRepo } from "@/modules/squadron/member/member.repo";
import { getAccountTypeOptions } from "@/modules/squadron/account/account-type.enum";
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from "discord.js";

@Injectable()
export class AccountAutocompleteInterceptor extends AutocompleteInterceptor {
	private readonly logger = new Logger(AccountAutocompleteInterceptor.name);

	constructor(private accountRepo: AccountRepo, private memberRepo: MemberRepo) {
		super();
	}

	async transformOptions(interaction: AutocompleteInteraction): Promise<void> {
		const focused = interaction.options.getFocused(true);
		let options: ApplicationCommandOptionChoiceData[] = [];

		const inputValue = focused.value.toString();

		if (focused.name === "account-id") {
			options = this.accountRepo
				.selectAllNumAndId()
				.filter((choice) => choice.id.includes(inputValue))
				.slice(0, 25)
				.map((choice) => ({ name: choice.id, value: choice.num }));
		}
		if (focused.name === "member") {
			options = this.memberRepo
				.selectAllIdAndName()
				.filter((choice) => choice.nickname.includes(inputValue))
				.slice(0, 25)
				.map((choice) => ({ name: choice.nickname, value: choice.discordId }));
		}

		if (focused.name === "account-type") {
			options = getAccountTypeOptions();
		}

		return interaction.respond(options);
	}
}
