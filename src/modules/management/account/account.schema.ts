import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApplicationCommandOptionChoiceData } from "discord.js";
import { Member } from "@/modules/management/member/member.schema";

export enum AccountType {
	MAIN_CORE = "🇸 聯隊戰主帳",
	MAIN_CASUAL = "🇳 休閒主帳",
	ALT_PRIVATE = "🇦 個人小帳",
	MAIN_PUBLIC = "🇨 公用主帳",
	ALT_PUBLIC = "🇧 公用小帳",
	SPONSOR = "🇽 贊助者",
	ALT_SEMIPUBLIC = "🇩 半公用小帳",
}

@Schema()
export class Account {
	@Prop()
	_id: string;

	@Prop()
	personalRating: number;

	@Prop()
	activity: number;

	@Prop()
	joinDate: string;

	@Prop({ type: String, ref: Member.name, required: false, default: null })
	owner: string | null;

	@Prop({ type: String, enum: [null, ...Object.values(AccountType)] })
	type: AccountType | null;

	@Prop()
	isExist: boolean;
}

export function getAccountTypeOptions() {
	return Object.values(AccountType).map<ApplicationCommandOptionChoiceData>((value) => ({ name: value, value: value }));
}

export const AccountModelDef: ModelDefinition = { name: Account.name, schema: SchemaFactory.createForClass(Account) };
