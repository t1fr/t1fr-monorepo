import { AutocompleteInterceptor } from "necord";
import { Injectable, Logger } from "@nestjs/common";
import { AccountRepo } from "@/modules/management/account/account.repo";
import { MemberRepo } from "@/modules/management/member/member.repo";
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from "discord.js";
import { getAccountTypeOptions } from "@/modules/management/account/account.schema";

@Injectable()
export class MyAutocompleteInterceptor extends AutocompleteInterceptor {
	private readonly logger = new Logger(MyAutocompleteInterceptor.name);

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
			options = (await this.accountRepo.find({ _id: { $regex: RegExp(inputValue, "i") } })).map((choice) => ({ name: choice.id, value: choice._id }));
		}
		if (focused.name === "member") {
			options = (await this.memberRepo.find(inputValue)).map((choice) => ({ name: choice.nickname, value: choice._id }));
		}

		if (focused.name === "account-type") {
			options = getAccountTypeOptions();
		}

		return interaction.respond(options);
	}
}
