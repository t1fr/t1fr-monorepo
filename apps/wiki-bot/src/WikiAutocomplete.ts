import { Inject, Injectable } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { Country, Search, SearchResult } from "@t1fr/backend/wiki";
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from "discord.js";
import { AutocompleteInterceptor } from "necord";
import { I18nService } from "nestjs-i18n";
import { Result } from "ts-results-es";

@Injectable()
export class WikiAutocompleteInterceptor extends AutocompleteInterceptor {

  @Inject()
  private readonly queryBus: QueryBus;

  @Inject()
  private readonly i18nService: I18nService;

  private translateAutocomplete({ name, country, rank }: SearchResult["vehicles"][number], locale: string) {
    return this.i18nService.t("common.autocomplete", { args: { name: name, country: this.translateCountry(country, locale), rank: rank }, lang: locale });
  }

  private translateCountry(country: string, locale: string) {
    return this.i18nService.t(`country.${country}`, { lang: locale });
  }

  private static CountryChoices = Object.values(Country);

  async transformOptions(interaction: AutocompleteInteraction) {
    const focused = interaction.options.getFocused(true);
    const country = interaction.options.getString("country");
    const query = interaction.options.getString("query");
    const rank = interaction.options.getNumber("rank");
    const locale = interaction.locale;
    if (focused.name === "query") {
      const result = await this.queryBus.execute<Search, Result<SearchResult, string>>(new Search({ name: query, limit: 25, rank, country }));
      if (result.isErr()) return interaction.respond([]);
      else interaction.respond(result.value.vehicles.map<ApplicationCommandOptionChoiceData>(vehicle => ({
        name: this.translateAutocomplete(vehicle, locale),
        value: vehicle.id,
      })));
    } else if (focused.name === "country") {
      const localizedCountries = WikiAutocompleteInterceptor.CountryChoices
        .map(it => ({ name: this.translateCountry(it, locale), value: it }))
        .filter(it => it.name.includes(country))
        .slice(0, 25);
      return interaction.respond(localizedCountries);
    }
  }
}
