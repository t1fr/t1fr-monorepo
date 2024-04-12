import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AdvancedI18nService } from "@t1fr/backend/i18n";
import { ListEnumableField, Search, SearchResult } from "@t1fr/backend/wiki";
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from "discord.js";
import { AutocompleteInterceptor } from "necord";
import { Result } from "ts-results-es";

@Injectable()
export class WikiAutocompleteInterceptor extends AutocompleteInterceptor implements OnApplicationBootstrap {

    @Inject()
    private readonly queryBus: QueryBus;

    @Inject()
    private readonly i18nService: AdvancedI18nService;


    private readonly options = { "countries": [], "ranks": [], "classes": [] };

    @Cron(CronExpression.EVERY_DAY_AT_8AM)
    async refreshOptions() {
        const [countries, ranks, classes] = await Promise.all([
            this.queryBus.execute<ListEnumableField, string[]>(new ListEnumableField("country")),
            this.queryBus.execute<ListEnumableField, string[]>(new ListEnumableField("rank")),
            this.queryBus.execute<ListEnumableField, string[]>(new ListEnumableField("vehicleClasses")),
        ]);

        this.options.countries = countries;
        this.options.ranks = ranks;
        this.options.classes = classes;
    }

    private translateAutocomplete({ name, country, rank }: SearchResult["vehicles"][number], locale: string) {
        return this.i18nService.t("common.autocomplete", { interpolate: { country: `country.${country}` }, args: { name: name, rank: rank }, lang: locale });
    }

    private translateCountry(country: string, locale: string) {
        return this.i18nService.t(`country.${country}`, { lang: locale });
    }

    private translateClass(vehicleClass: string, locale: string) {
        return this.i18nService.t(`class.${vehicleClass}`, { lang: locale });
    }

    private toOptions(items: string[], transformer: (it: string) => string, search?: string): ApplicationCommandOptionChoiceData[] {
        return items.map(it => ({ name: transformer(it), value: it }))
            .filter(it => search ? it.name.includes(search) : true)
            .slice(0, 25);
    }


    async transformOptions(interaction: AutocompleteInteraction) {
        const focused = interaction.options.getFocused(true);
        const country = interaction.options.getString("country", false);
        const query = interaction.options.getString("query", true).trim();
        const rank = interaction.options.getNumber("rank", false);
        const vehicleClass = interaction.options.getString("class", false);
        const locale = interaction.locale;
        if (focused.name === "query") {
            const result = await this.queryBus.execute<Search, Result<SearchResult, string>>(new Search({ name: query, limit: 25, rank, country }));
            if (result.isErr()) return interaction.respond([]);
            else interaction.respond(result.value.vehicles.map<ApplicationCommandOptionChoiceData>(vehicle => ({
                name: this.translateAutocomplete(vehicle, locale),
                value: vehicle.id,
            })));
        } else if (focused.name === "country") {
            return interaction.respond(this.toOptions(this.options.countries, it => this.translateCountry(it, locale), country));
        } else if (focused.name === "rank") {
            return interaction.respond(this.toOptions(this.options.ranks, it => it, `${rank}`));
        } else if (focused.name === "class") {
            return interaction.respond(this.toOptions(this.options.classes, it => this.translateClass(it, locale), vehicleClass));
        }
    }

    async onApplicationBootstrap() {
        await this.refreshOptions();
    }
}
