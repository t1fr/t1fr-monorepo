import { Inject, Injectable, UseInterceptors } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AdvancedI18nService } from "@t1fr/backend/i18n";
import { FindById, FindByIdOutput, ScrapeDatamine } from "@t1fr/backend/wiki";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { range } from "lodash-es";
import { Context, createCommandGroupDecorator, NumberOption, Options, SlashCommandContext, StringOption, Subcommand } from "necord";
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
    query!: string;
    @NumberOption({
        name: "rank",
        name_localizations: { "zh-TW": "階級" },
        choices: RankChoices,
        description: "rank",
        description_localizations: { "zh-TW": "階級" },
    })
    rank!: number | null;
    @StringOption({
        name: "country",
        name_localizations: { "zh-TW": "國家" },
        autocomplete: true,
        description: "country",
        description_localizations: { "zh-TW": "國家" },
    })
    country!: string | null;
    @StringOption({
        name: "class",
        name_localizations: { "zh-TW": "類型" },
        autocomplete: true,
        description: "class",
        description_localizations: { "zh-TW": "類型" },
    })
    vehicleClass!: string | null;
}

@WikiCommandGroup()
@Injectable()
export class WikiCommand {

    @Inject()
    private readonly commandBus!: CommandBus;

    @Inject()
    private readonly queryBus!: QueryBus;

    @Inject()
    private readonly i18nService!: AdvancedI18nService;

    private isFromT1fr(interaction: ChatInputCommandInteraction) {
        return interaction.guild?.id === "1046623840710705152";
    }

    private generateDescription(vehicle: FindByIdOutput["vehicle"], lang: string, promoteSquad: boolean) {
        const { name, country, operator, classes, rank, type, obtainSource } = vehicle;
        const localizedMainClass = this.i18nService.t(`class.${classes[0]}`, { lang }).toLocaleLowerCase();
        const localizedType = this.i18nService.t(`class.${type}`, { lang }).toLocaleLowerCase();
        const description = [this.i18nService.t("common.description.intro", {
            lang,
            args: { type: localizedType, name, rank, mainClass: localizedMainClass },
            interpolate: Object.assign({ country: `country.${country}` }, operator === country ? undefined : { operator: `country.${operator}` }),
        })];

        if (obtainSource === "gift") {
            if (vehicle.event) this.i18nService.t("common.description.event", { lang, interpolate: { event: `event.${vehicle.event}` } });
            this.i18nService.t("common.description.gift", { lang });
        } else if (obtainSource === "store")
            description.push(this.i18nService.t("common.description.store", { lang, args: { url: vehicle.storeUrl } }));
        else if (obtainSource === "marketplace") {
            if (vehicle.event) this.i18nService.t("common.description.event", { lang, interpolate: { event: `event.${vehicle.event}` } });
            description.push(this.i18nService.t("common.description.marketplace", { lang, args: { url: vehicle.marketplaceUrl } }));
        } else if (obtainSource === "gold") {
            if (vehicle.event) this.i18nService.t("common.description.event", { lang, interpolate: { event: `event.${vehicle.event}` } });
            description.push(this.i18nService.t("common.description.gold", { lang: lang, args: { price: vehicle.goldPrice } }));
        } else if (obtainSource === "squad")
            description.push(this.i18nService.t(`common.description.${promoteSquad ? "squadWithPromotion" : "squad"}`, { lang: lang }));
        return description.join("\n");
    }

    @Subcommand({ name: "sync", description: "同步載具資料庫" })
    async syncDatabase(@Context() [interaction]: SlashCommandContext) {
        await interaction.deferReply();
        const result = await this.commandBus.execute(new ScrapeDatamine());
        await interaction.followUp(result.mapOrElse(error => `錯誤: ${error.toString()}`, value => `已同步載具資料庫，更新 ${value} 筆載具`));
    }

    @UseInterceptors(WikiAutocompleteInterceptor)
    @Subcommand({
        name: "vehicle",
        description: "search vehicle by name, can be filtered by other conditions",
        descriptionLocalizations: { "zh-TW": "以名稱搜尋載具，可以其他條件過濾" },
    })
    async searchVehicle(@Context() [interaction]: SlashCommandContext, @Options() { query }: SearchVehicleOption) {
        await interaction.deferReply();
        const result = await this.queryBus.execute(new FindById({ id: query }));
        if (result.isErr()) return interaction.followUp(result.error.toString());

        const vehicle = result.value.vehicle;
        const lang = interaction.locale;
        const { arcade, realistic, simulator } = vehicle.battleRating;
        const embed = new EmbedBuilder({
            author: { name: vehicle.classes.slice(1).map(it => this.i18nService.t(`class.${it}`, { lang })).join(" ") },
            title: vehicle.name,
            url: vehicle.wikiUrl,
            description: this.generateDescription(vehicle, lang, this.isFromT1fr(interaction)),
            image: { url: vehicle.thumbnailUrl },
            fields: [
                { name: this.i18nService.t("common.description.arcade", { lang }), value: arcade.toFixed(1), inline: true },
                { name: this.i18nService.t("common.description.realistic", { lang }), value: realistic.toFixed(1), inline: true },
                { name: this.i18nService.t("common.description.simulator", { lang }), value: simulator.toFixed(1), inline: true },
            ],
            thumbnail: { url: vehicle.imageUrl },
        });

        interaction.followUp({ embeds: [embed] });
    }
}
