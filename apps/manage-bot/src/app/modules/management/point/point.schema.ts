import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Member } from "../member/member.schema";

export const PointTypes = ["獎勵", "懲罰", "請假"] as const;

export type PointType = (typeof PointTypes)[number];

export const RewardPointCategories = ["結算發放", "傑出貢獻", "兌換獎品", "接收轉讓", "轉讓積分", "轉讓費用", "離隊清零"] as const;

export type RewardPointCategory = (typeof RewardPointCategories)[number];

@Schema({ versionKey: false })
export class PointEvent {
	@Prop({ ref: Member.name })
	member: string;

	@Prop({ enum: PointTypes, type: String })
	type: PointType;

	@Prop({ enum: RewardPointCategories, type: String })
	category: RewardPointCategory;

	@Prop({
		type: Types.Decimal128,
		transform(value: Types.Decimal128) {
			return parseFloat(value.toString());
		},
	})
	delta: number;

	@Prop()
	comment: string;

	@Prop()
	date: string;
}

export const PointEventModelDef: ModelDefinition = { name: PointEvent.name, schema: SchemaFactory.createForClass(PointEvent) };
