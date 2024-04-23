import { Inject, Injectable } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { SearchAccount, SearchAccountOutput, SearchAccountResult } from "@t1fr/backend/member-manage";
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from "discord.js";
import { AutocompleteInterceptor } from "necord";

@Injectable()
export class AccountAutocompleteInterceptor extends AutocompleteInterceptor {
    @Inject()
    private readonly queryBus!: QueryBus;

    private static searchAccountToOption(data: SearchAccountOutput[number]): ApplicationCommandOptionChoiceData {
        return { value: data.id, name: data.name };
    }

    async transformOptions(interaction: AutocompleteInteraction): Promise<void> {
        const focused = interaction.options.getFocused(true);
        if (focused.name === "account-id") {
            const name = interaction.options.getString("account-id", true);
            const result = await this.queryBus.execute<SearchAccount, SearchAccountResult>(new SearchAccount({ name }));
            result
                .map(data => interaction.respond(data.slice(0, 25).map(AccountAutocompleteInterceptor.searchAccountToOption)))
                .mapErr(() => interaction.respond([]));
        }
    }
}