import { Inject, Injectable, UseInterceptors } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { DomainError, FindById, FindByIdResult, ScapeDatamine } from "@t1fr/backend/wiki";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { range } from "lodash";
import { Context, createCommandGroupDecorator, NumberOption, Options, SlashCommandContext, StringOption, Subcommand } from "necord";
import { I18nService } from "nestjs-i18n";
import { Result } from "ts-results-es";
import { WikiAutocompleteInterceptor } from "./WikiAutocomplete";

const WikiCommandGroup = createCommandGroupDecorator({
    name: "wiki",
    description: "Search War Thunder wiki",
    descriptionLocalizations: { "zh-TW": "查詢戰雷維基" },
});

const RankChoices = range(1, 8).map(it => ({ name: `${it}`, value: it }));

export class SearchVehicleOption {
    @StringOption({
        name: "query",
        name_localizations: { "zh-TW": "搜尋詞" },
        autocomplete: true,
        required: true,
        description: "search query",
        description_localizations: { "zh-TW": "搜尋詞" },
    })
    query: string;
    @NumberOption({
        name: "rank",
        name_localizations: { "zh-TW": "階級" },
        choices: RankChoices,
        description: "rank",
        description_localizations: { "zh-TW": "階級" },
    })
    rank: number;
    @StringOption({
        name: "country",
        name_localizations: { "zh-TW": "國家" },
        autocomplete: true,
        description: "country",
        description_localizations: { "zh-TW": "國家" },
    })
    country: string;
    @StringOption({
        name: "class",
        name_localizations: { "zh-TW": "類型" },
        autocomplete: true,
        description: "class",
        description_localizations: { "zh-TW": "類型" },
    })
    vehicleClass: string;
}

@WikiCommandGroup()
@Injectable()
export class WikiCommand {

    @Inject()
    private readonly commandBus: CommandBus;

    @Inject()
    private readonly queryBus: QueryBus;

    @Inject()
    private readonly i18nService: I18nService;

    private getTranslation(set: "country" | "class" | "event" | "common.description", key: string, locale: string, args?: Record<string, string>) {
        return this.i18nService.t(`${set}.${key}`, { lang: locale, args });
    }

    private isFromT1fr(interaction: ChatInputCommandInteraction) {
        return interaction.guild.id === "1046623840710705152";
    }

    private generateDescription(vehicle: FindByIdResult["vehicle"], locale: string, promoteSquad: boolean) {
        const { name, country, operator, classes, rank, event, obtainSource, storeUrl, marketplaceUrl, goldPrice } = vehicle;
        const localizedCountry = this.getTranslation("country", country, locale);
        const localizedOperator = this.getTranslation("country", operator, locale);
        const localizedType = this.getTranslation("class", classes[0], locale).toLocaleLowerCase();
        const description = [this.getTranslation("common.description", "intro", locale, {
            name, country: localizedCountry, rank: `${rank}`, operator: localizedOperator, type: localizedType,
        })];
        if (event) {
            const localizedEvent = this.getTranslation("event", event, locale);
            description.push(this.getTranslation("common.description", "event", locale, { event: localizedEvent }));
        }
        if (obtainSource === "gift" && !event) description.push(this.getTranslation("common.description", "gift", locale));
        else if (obtainSource === "store") description.push(this.getTranslation("common.description", "store", locale, { url: storeUrl }));
        else if (obtainSource === "marketplace") description.push(this.getTranslation("common.description", "marketplace", locale, { url: marketplaceUrl }));
        else if (obtainSource === "gold") description.push(this.getTranslation("common.description", "gold", locale, { price: `${goldPrice}` }));
        else if (obtainSource === "squad") description.push(this.getTranslation("common.description", promoteSquad ? "squadWithPromotion" : "squad", locale));
        return description.join("\n");
    }

    @Subcommand({ name: "sync", description: "同步載具資料庫" })
    async syncDatabase(@Context() [interaction]: SlashCommandContext) {
        await interaction.deferReply();
        const result = await this.commandBus.execute<ScapeDatamine, Result<number, DomainError>>(new ScapeDatamine());
        await interaction.followUp(result.isOk() ? `已同步載具資料庫，更新 ${result.value} 筆載具` : result.error);
    }

    @UseInterceptors(WikiAutocompleteInterceptor)
    @Subcommand({
        name: "vehicle",
        description: "search vehicle by name, can be filtered by other conditions",
        descriptionLocalizations: { "zh-TW": "以名稱搜尋載具，可以其他條件過濾" },
    })
    async searchVehicle(@Context() [interaction]: SlashCommandContext, @Options() { query }: SearchVehicleOption) {
        await interaction.deferReply();
        const result = await this.queryBus.execute<FindById, Result<FindByIdResult, string>>(new FindById({ id: query }));
        if (result.isErr()) return interaction.followUp(result.error);
        const vehicle = result.value.vehicle;
        const locale = interaction.locale;
        const { arcade, realistic, simulator } = vehicle.battleRating;
        const embed = new EmbedBuilder({
            author: { name: vehicle.classes.slice(1).map(it => this.getTranslation("class", it, locale)).join(" ") },
            title: vehicle.name,
            url: vehicle.wikiUrl,
            description: this.generateDescription(vehicle, locale, this.isFromT1fr(interaction)),
            image: { url: vehicle.thumbnailUrl },
            fields: [
                { name: this.getTranslation("common.description", "arcade", locale), value: arcade.toFixed(1), inline: true },
                { name: this.getTranslation("common.description", "realistic", locale), value: realistic.toFixed(1), inline: true },
                { name: this.getTranslation("common.description", "simulator", locale), value: simulator.toFixed(1), inline: true },
            ],
            thumbnail: { url: vehicle.imageUrl },
        });

        interaction.followUp({ embeds: [embed] });
    }
}
