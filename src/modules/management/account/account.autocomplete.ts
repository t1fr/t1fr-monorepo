import { AutocompleteInterceptor } from "necord";
import { Injectable, Logger } from "@nestjs/common";
import { AccountRepo } from "@/modules/management/account/account.repo";
import { MemberRepo } from "@/modules/management/member/member.repo";
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from "discord.js";
import { getAccountTypeOptions } from '@/modules/management/account/account.schema';

@Injectable()
export class AccountAutocompleteInterceptor extends AutocompleteInterceptor {
	private readonly logger = new Logger(AccountAutocompleteInterceptor.name);

	constructor(
		private accountRepo: AccountRepo,
		private memberRepo: MemberRepo,
	) {
		super();
	}

	async transformOptions(interaction: AutocompleteInteraction): Promise<void> {
		const focused = interaction.options.getFocused(true);
		let options: ApplicationCommandOptionChoiceData[] = [];

		const inputValue = focused.value.toString();

		if (focused.name === "account-id") {
			options = (await this.accountRepo.find())
				.filter((choice) => choice.id.includes(inputValue))
				.slice(0, 25)
				.map((choice) => ({ name: choice.id, value: choice._id }));
		}
		if (focused.name === "member") {
			options = (await this.memberRepo.selectAllIdAndName())
				.filter((choice) => choice.nickname.includes(inputValue))
				.slice(0, 25)
				.map((choice) => ({ name: choice.nickname, value: choice._id }));
		}

		if (focused.name === "account-type") {
			options = getAccountTypeOptions();
		}

		return interaction.respond(options);
	}
}
