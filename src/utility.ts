import { ActionRowBuilder, ModalActionRowComponentBuilder, RestOrArray } from "discord.js";

export function configLayout(layout: ModalActionRowComponentBuilder[]) {
	return layout.map((value) => new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(value));
}