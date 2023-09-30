import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Member } from "@/modules/management/member/member.schema";

export const AccountTypes = ["🇸 聯隊戰主帳", "🇳 休閒主帳", "🇦 個人小帳", "🇨 公用主帳", "🇧 公用小帳", "🇽 贊助者", "🇩 半公用主帳"] as const;
export type AccountType = (typeof AccountTypes)[number];

export class AccountUpdateData { type?: AccountType; ownerId?: string;}

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

	@Prop({ type: String, enum: [null, ...AccountTypes] })
	type: AccountType | null;

	@Prop()
	isExist: boolean;
}

export const AccountModelDef: ModelDefinition = { name: Account.name, schema: SchemaFactory.createForClass(Account) };
