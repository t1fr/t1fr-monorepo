import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Member } from "@/modules/management/member/member.schema";

@Schema({ autoCreate: false, autoIndex: false, collection: "summaries" })
export class Summary implements Pick<Member, "_id" | "nickname"> {
	@Prop()
	_id: string;

	@Prop()
	nickname: string;

	@Prop()
	accounts: { _id: string; activity: number; personalRating: number; type: string }[];

	@Prop()
	points: { _id: string; sum: number; logs: { category: string; date: string; delta: number; detail: string }[] }[];
}

export const SummaryModelDef: ModelDefinition = { name: Summary.name, schema: SchemaFactory.createForClass(Summary) };