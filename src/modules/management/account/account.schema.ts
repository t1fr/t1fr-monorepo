import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApplicationCommandOptionChoiceData } from "discord.js";
import { Member } from "@/modules/management/member/member.schema";

@Schema()
export class Account {
	@Prop()
	_id: string;

	@Prop()
	personalRating: number;

	@Prop()
	activity: number;

	@Prop()
	joinDate: Date;

	@Prop({ ref: Member.name, required: false, default: null })
	owner: string | null;

	@Prop({ enum: [null, ...getAccountTypeOptions()] })
	type: AccountType | null;

	@Prop()
	isExist: boolean;
}

export enum AccountType {
	MAIN_CASUAL = "🇸 聯隊戰主帳",
	MAIN_CORE = "🇸 聯隊戰主帳",
	ALT_PRIVATE = "🇳 休閒主帳",
	MAIN_PUBLIC = "🇦 個人小帳",
	ALT_PUBLIC = "🇨 公用主帳",
	SPONSOR = "🇧 公用小帳",
	ALT_SEMIPUBLIC = "🇩 半公用小帳",
}

export function getAccountTypeOptions() {
	return Object.values(AccountType).map<ApplicationCommandOptionChoiceData>((value) => ({ name: value, value: value }));
}

export const AccountModelDef: ModelDefinition = { name: Account.name, schema: SchemaFactory.createForClass(Account) };
