import { NumberOption, StringOption } from "necord";

export class SetOwnershipOption {
	@NumberOption({
		name: "account-id",
		description: "戰雷 ID",
		required: true,
		autocomplete: true,
	})
	accountNum: number;

	@StringOption({
		name: "member",
		description: "擁有者 DC 帳號",
		required: true,
		autocomplete: true,
	})
	memberDiscordId: string;
}
