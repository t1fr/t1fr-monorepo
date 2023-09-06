import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Member } from "@/modules/management/member/member.schema";

export enum PointType {
	REWARD = "獎勵",
	PUNISHMENT = "懲罰",
	ABSENSE = "請假",
}

export const RewardPointCategories = ["結算發放", "傑出貢獻", "兌換獎品", "接收轉讓", "轉讓積分", "轉讓費用", "離隊清零"] as const;

export type RewardPointCategory = (typeof RewardPointCategories)[number];

@Schema()
export class PointEvent {
	@Prop({ ref: Member.name })
	member: string;

	@Prop({ enum: Object.values(PointType) })
	type: PointType;

	@Prop({ enum: RewardPointCategories })
	category: RewardPointCategory;

	@Prop()
	delta: number;

	@Prop()
	comment: string;

	@Prop()
	date: string;
}

export const PointEventModelDef: ModelDefinition = { name: PointEvent.name, schema: SchemaFactory.createForClass(PointEvent) };
