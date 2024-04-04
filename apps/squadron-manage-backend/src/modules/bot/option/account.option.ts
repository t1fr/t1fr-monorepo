import { BooleanOption, StringOption } from "necord";
import { AccountType, AccountTypes } from "../../management";

export class SetAccountTypeOption {
	@StringOption({ name: "account-id", description: "戰雷 ID", required: true, autocomplete: true })
	accountId: string;

	@StringOption({ name: "account-type", description: "帳號類型", required: true, choices: AccountTypes.map(type => ({ name: type, value: type })) })
	accountType: AccountType;
}

export class SetOwnershipOption {
	@StringOption({ name: "account-id", description: "戰雷 ID", required: true, autocomplete: true })
	accountId: string;

	@StringOption({ name: "member", description: "擁有者 DC 帳號", required: true, autocomplete: true })
	memberDiscordId: string;
}

export class CalculateRewardPointOption {
	@BooleanOption({ name: "simulate", description: "是否試算，不紀錄結果", required: true })
	isSimulate: boolean = true;
	@BooleanOption({ name: "verbose", description: "是否顯示原因" })
	verbose: boolean = false;
}