import { Injectable } from "@nestjs/common";
import { MemberQueryRepo, type SearchAccountByNameDTO } from "@t1fr/backend/member-manage";
import { type ApplicationCommandOptionChoiceData, AutocompleteInteraction } from "discord.js";
import { AutocompleteInterceptor } from "necord";

@Injectable()
export class AccountAutocompleteInterceptor extends AutocompleteInterceptor {
    @MemberQueryRepo()
    private readonly memberRepo!: MemberQueryRepo;

    private static searchAccountToOption(data: SearchAccountByNameDTO): ApplicationCommandOptionChoiceData {
        return { value: data.id, name: data.name };
    }

    async transformOptions(interaction: AutocompleteInteraction): Promise<void> {
        const focused = interaction.options.getFocused(true);
        if (focused.name === "account-id") {
            const name = interaction.options.getString("account-id", true);

            this.memberRepo.searchAccountByName(name)
                .then(data => interaction.respond(data.slice(0, 25).map(AccountAutocompleteInterceptor.searchAccountToOption)))
                .catch(() => interaction.respond([]));
        }
    }
}