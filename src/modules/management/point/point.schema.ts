import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Member } from "@/modules/management/member/member.schema";

export enum PointType {
	REWARD = "獎勵",
	PUNISHMENT = "懲罰",
	ABSENSE = "請假",
}

@Schema()
export class PointEvent {
	@Prop({ ref: Member.name })
	member: string;

	@Prop({ enum: Object.values(PointType) })
	category: PointType;

	@Prop()
	delta: number;

	@Prop()
	comment: string;
}

export const PointEventModelDef: ModelDefinition = { name: PointEvent.name, schema: SchemaFactory.createForClass(PointEvent) };
