import { BooleanOption } from "necord";

export class SetScheduleOption {
	@BooleanOption({
		name: "is-notify",
		description: "是否標註聯隊戰隊員",
		required: true,
	})
	isNotify: boolean;
}
