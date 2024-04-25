import { Inject, Injectable } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { AdvancedI18nService } from "@t1fr/backend/i18n";
import { ListEnumableField, Search, SearchOutput } from "@t1fr/backend/wiki";
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from "discord.js";
import { AutocompleteInterceptor } from "necord";

@Injectable()
export class WikiAutocompleteInterceptor extends AutocompleteInterceptor {

    @Inject()
    private readonly queryBus!: QueryBus;

    @Inject()
    private readonly i18nService!: AdvancedI18nService;


    private translateAutocomplete({ name, country, rank }: SearchOutput["vehicles"][number], locale: string) {
        return this.i18nService.t("common.autocomplete", { interpolate: { country: `country.${country}` }, args: { name: name, rank: rank }, lang: locale });
    }

    private translateCountry(country: string, locale: string) {
        return this.i18nService.t(`country.${country}`, { lang: locale });
    }

    private translateClass(vehicleClass: string, locale: string) {
        return this.i18nService.t(`class.${vehicleClass}`, { lang: locale });
    }

    private toOptions(items: string[], transformer: (it: string) => string, search: string | null): ApplicationCommandOptionChoiceData[] {
        return items.map(it => ({ name: transformer(it), value: it }))
            .filter(it => search ? it.name.includes(search) : true)
            .slice(0, 25);
    }


    async transformOptions(interaction: AutocompleteInteraction) {
        const focused = interaction.options.getFocused(true);
        const query = interaction.options.getString("query", true).trim();
        const country = interaction.options.getString("country", false);
        const rank = interaction.options.getNumber("rank", false);
        const vehicleClass = interaction.options.getString("class", false);
        const locale = interaction.locale;
        if (focused.name === "query") {
            const result = await this.queryBus.execute(new Search({ name: query, limit: 25, rank, country }));
            if (result.isErr()) return interaction.respond([]);
            else interaction.respond(result.value.vehicles.map<ApplicationCommandOptionChoiceData>(vehicle => ({
                name: this.translateAutocomplete(vehicle, locale),
                value: vehicle.id,
            })));
        } else if (focused.name === "country") {
            const result = await this.queryBus.execute(new ListEnumableField("country"));
            if (result.isErr()) return interaction.respond([]);
            return interaction.respond(this.toOptions(result.value, it => this.translateCountry(it, locale), country));
        } else if (focused.name === "rank") {
            const result = await this.queryBus.execute(new ListEnumableField("rank"));
            if (result.isErr()) return interaction.respond([]);
            return interaction.respond(this.toOptions(result.value, it => it, `${rank}`));
        } else if (focused.name === "class") {
            const result = await this.queryBus.execute(new ListEnumableField("vehicleClasses"));
            if (result.isErr()) return interaction.respond([]);
            return interaction.respond(this.toOptions(result.value, it => this.translateClass(it, locale), vehicleClass));
        }
    }
}
