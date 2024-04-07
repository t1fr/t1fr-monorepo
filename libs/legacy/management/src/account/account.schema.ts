import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Member } from "../member";

export const AccountTypes = ["🇸 聯隊戰主帳", "🇳 休閒主帳", "🇦 個人小帳", "🇨 公用主帳", "🇧 公用小帳", "🇽 贊助者", "🇩 半公用主帳"] as const;
export type AccountType = (typeof AccountTypes)[number];

export class AccountUpdateData {
  @ApiProperty({ enum: AccountTypes, required: false })
  type?: AccountType;

  @ApiProperty({ required: false })
  owner?: string;
}

export class AccountListData implements Omit<Account, "owner" | "isExist"> {
  @ApiProperty({ example: "HI_OuO" })
  _id!: string;

  @ApiProperty({ example: { nickname: "T1FR丨表情丨HI_OuO", _id: "456451265474" } as Member, required: false })
  owner!: Member;

  @ApiProperty({ example: 3411 })
  activity!: number;

  @ApiProperty({ example: "2022-11-01", description: "日期格式 YYYY-MM-DD" })
  joinDate!: string;

  @ApiProperty({ example: "1233" })
  personalRating!: number;

  @ApiProperty({ example: AccountTypes[0], required: false })
  type!: AccountType | null;
}

@Schema()
export class Account {
  @Prop()
  _id!: string;

  @Prop()
  personalRating!: number;

  @Prop()
  activity!: number;

  @Prop()
  joinDate!: string;

  @Prop({ type: String, ref: Member.name, required: false, default: null })
  owner!: string | null;

  @Prop({ type: String, enum: [null, ...AccountTypes] })
  type!: AccountType | null;

  @Prop()
  isExist!: boolean;
}

export const AccountModelDef: ModelDefinition = { name: Account.name, schema: SchemaFactory.createForClass(Account) };
