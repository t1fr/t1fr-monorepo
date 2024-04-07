import { AutocompleteInterceptor } from "necord";
import { Injectable } from "@nestjs/common";
import { MemberService, AccountService } from "@t1fr/legacy/management";
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from "discord.js";

@Injectable()
export class UserAutocompleteInterceptor extends AutocompleteInterceptor {
    constructor(private accountService: AccountService, private memberRepo: MemberService) {
        super();
    }

    async transformOptions(interaction: AutocompleteInteraction): Promise<void> {
        const focused = interaction.options.getFocused(true);
        let options: ApplicationCommandOptionChoiceData[] = [];

        const inputValue = focused.value.toString();

        if (focused.name === "account-id") {
            options = (await this.accountService.searchByIdContain(inputValue)).map(choice => ({ name: choice._id, value: choice._id }));
        }
        if (focused.name === "member") {
            options = (await this.memberRepo.find(inputValue)).map(choice => ({ name: choice.nickname, value: choice._id }));
        }
        return interaction.respond(options);
    }
}
