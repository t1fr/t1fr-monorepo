import { AutocompleteInterceptor } from "necord";
import { Injectable } from "@nestjs/common";
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from "discord.js";
import { WikiRepo } from "@/modules/wiki/wiki.repo";

@Injectable()
export class WikiAutocompleteInterceptor extends AutocompleteInterceptor {
	constructor(private readonly wikiRepo: WikiRepo) {
		super();
	}

	async transformOptions(interaction: AutocompleteInteraction) {
		const focused = interaction.options.getFocused(true);
		let options: ApplicationCommandOptionChoiceData[] = [];

		const inputValue = focused.value.toString();
		if (focused.name === "query") {
			const vehicles = await this.wikiRepo.search(inputValue);
			options = vehicles.map<ApplicationCommandOptionChoiceData>(vehicle => ({
				name: `${vehicle.name}, ${vehicle.country}, ${vehicle.rank} 階`,
				value: vehicle.key,
			}));
		}
		return interaction.respond(options);
	}
}
