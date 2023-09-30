import { Injectable, UseInterceptors } from "@nestjs/common";
import { Context, createCommandGroupDecorator, Options, SlashCommandContext, StringOption, Subcommand } from "necord";
import { WikiService } from "@/modules/wiki/wiki.service";
import { EmbedBuilder } from "discord.js";
import { Vehicle } from "@/modules/wiki/vehicle.schema";
import { WikiAutocompleteInterceptor } from "@/modules/bot/autocomplete/wiki.autocomplete";

const WikiCommandGroup = createCommandGroupDecorator({ name: "wiki", description: "查詢戰雷維基" });

export class SearchVehicleOption {
	@StringOption({ name: "query", autocomplete: true, required: true, description: "搜尋詞" })
	query: string;
}

@WikiCommandGroup()
@Injectable()
export class WikiCommand {
	constructor(private readonly wikiRepo: WikiService) {}

	static generateDescription(vehicle: Vehicle) {
		const description = [`${vehicle.name} 是位於${vehicle.country}科技樹 ${vehicle.rank} 階的${vehicle.operator ?? ""}${vehicle.normal_type}`];
		if (vehicle.event) description.push(`為**${vehicle.event}**的獎勵載具之一`);
		if (vehicle.obtainFrom === "gift" && !vehicle.event) description.push("為特定活動贈品");
		else if (vehicle.obtainFrom === "store") description.push(`你可以在 **[Gaijin 商城](https://store.gaijin.net/story.php?id=${vehicle.store})**購買`);
		else if (vehicle.obtainFrom === "marketplace")
			description.push(`你可以在**[市場](https://trade.gaijin.net/?n=${vehicle.marketplace}&viewitem=&a=1067)**上交易獲得`);
		else if (vehicle.obtainFrom === "gold") description.push(`你可以在遊戲內支付 **${vehicle.cost_gold}** <:WtItemGoldenEagle:1047708655165911070> 購買`);
		else if (vehicle.squad)
			description.push(
				`你可以在遊戲內加入[聯隊](https://discord.com/channels/1046623840710705152/1145362065813405776)，累積聯隊經驗研發或透過 <:WtItemGoldenEagle:1047708655165911070> 購買`,
			);

		return description.join("\n");
	}

	@UseInterceptors(WikiAutocompleteInterceptor)
	@Subcommand({ name: "vehicle", description: "搜尋載具" })
	async searchVehicle(@Context() [interaction]: SlashCommandContext, @Options() { query }: SearchVehicleOption) {
		const defer = interaction.deferReply();
		const vehicle = await this.wikiRepo.getByKey(query);
		await defer;
		if (!vehicle) return interaction.followUp({ content: "查無載具" });

		const embed = new EmbedBuilder({
			author: { name: vehicle.extended_type?.join(" ") ?? "" },
			title: vehicle.name,
			url: `https://wiki.warthunder.com/${encodeURI(vehicle.name)}`,
			description: WikiCommand.generateDescription(vehicle),
			image: { url: `https://encyclopedia.warthunder.com/images/${vehicle.key.toLowerCase()}.png` },
			fields: [
				{ name: "街機娛樂", value: vehicle.br.arcade.toFixed(1), inline: true },
				{ name: "歷史性能", value: vehicle.br.realistic.toFixed(1), inline: true },
				{ name: "全真模擬", value: vehicle.br.simulator.toFixed(1), inline: true },
			],
			thumbnail: { url: vehicle.operatorImageUrl },
		});

		interaction.followUp({ embeds: [embed] });
	}
}