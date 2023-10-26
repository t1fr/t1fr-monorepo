import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Member } from "@/modules/management/member/member.schema";
import { PointType } from "@/modules/management/point/point.schema";
import { SchemaTypes } from "mongoose";

@Schema({ autoCreate: false, collection: "statistics" })
export class Statistic implements Omit<Member, "isExist"> {
	@Prop({ type: SchemaTypes.Mixed })
	points: { [type in PointType]: number };

	@Prop()
	_id: string;

	@Prop()
	avatarUrl: string;

	@Prop()
	isOfficer: boolean;

	@Prop()
	nickname: string;

	@Prop()
	noAccount: boolean;
}

export const StatisticModelDef: ModelDefinition = { name: Statistic.name, schema: SchemaFactory.createForClass(Statistic) };