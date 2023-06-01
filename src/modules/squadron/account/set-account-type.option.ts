import { NumberOption } from "necord";

export class SetAccountTypeOption {
	@NumberOption({
		name: "account-id",
		description: "戰雷 ID",
		required: true,
		autocomplete: true,
	})
	accountNum: number;

	@NumberOption({
		name: "account-type",
		description: "帳號類型",
		required: true,
		autocomplete: true,
	})
	accountType: number;
}
