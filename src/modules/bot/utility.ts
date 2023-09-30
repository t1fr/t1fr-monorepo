import { ActionRowBuilder, ModalActionRowComponentBuilder } from "discord.js";

export function configLayout(layout: ModalActionRowComponentBuilder[]): ActionRowBuilder<ModalActionRowComponentBuilder>[] {
	return layout.map(value => new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(value));
}

export function select<T>(array: T[], selection: (keyof T)[]) {
	const result = selection.reduce((acc, cur) => ({ ...acc, [cur]: [] }), {} as { [key in keyof T]: T[key][] });
	if (!array.length) return result;
	array.forEach(value => {
		for (const key of selection) result[key].push(value[key]);
	});
	return result;
}

