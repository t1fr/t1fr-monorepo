import { ActionRowBuilder, APIEmbedField, ModalActionRowComponentBuilder, RestOrArray } from "discord.js";

export function arrayToChoices(array: readonly string[]) {
	return array.map(value => ({ name: value, value }));
}

export function configLayout(layout: ModalActionRowComponentBuilder[]): ActionRowBuilder<ModalActionRowComponentBuilder>[] {
	return layout.map(value => new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(value));
}

export function selectToFields<T>(array: T[], selection: (keyof T)[], headers: string[]): RestOrArray<APIEmbedField> {
	const result = selection.reduce((acc, cur) => ({ ...acc, [cur]: [] }), {} as { [key in keyof T]: string[] });
	if (!array.length) return [];
	array.forEach(value => {
		for (const key of selection) result[key].push(`${value[key] ?? "無"}`);
	});

	return headers.map((header, index) => ({ name: header, value: result[selection[index]].join("\n"), inline: true }));
}



