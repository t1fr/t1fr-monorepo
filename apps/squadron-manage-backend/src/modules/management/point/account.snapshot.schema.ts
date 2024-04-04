import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Member, Account, AccountType, AccountTypes } from "../../management";

@Schema({ collection: "lastSeasonResult", autoCreate: false, autoIndex: false })
export class AccountSnapshot implements Pick<Account, "_id" | "activity" | "joinDate" | "owner" | "personalRating" | "type"> {
	@Prop()
	_id: string;

	@Prop()
	activity: number;

	@Prop()
	joinDate: string;

	@Prop({ type: String, ref: Member.name, required: false })
	owner: string | null;

	@Prop()
	personalRating: number;

	@Prop({ type: String, enum: [null, ...AccountTypes] })
	type: AccountType | null;
}

export const AccountSnapshotModelDef: ModelDefinition = { name: AccountSnapshot.name, schema: SchemaFactory.createForClass(AccountSnapshot) };