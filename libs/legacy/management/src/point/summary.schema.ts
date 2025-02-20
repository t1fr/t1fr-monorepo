import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { PointType, PointTypes } from "./point.schema";
import { Member } from "../member";

type PointGroup = { _id: string; sum: number; logs: { category: string; date: string; delta: number; detail: string }[] }[];
type PointMap = Record<PointType, { sum: number; logs: { category: string; date: string; delta: number; detail: string }[] }>;

@Schema({ autoCreate: false, autoIndex: false, collection: "summaries" })
export class Summary implements Pick<Member, "_id" | "nickname" | "onVacation"> {
  @Prop()
  _id!: string;

  @Prop()
  nickname!: string;

  @Prop()
  accounts!: { _id: string; activity: number; personalRating: number; type: string }[];

  @Prop({ get: transformPoint, type: SchemaTypes.Mixed, transform: (value: PointMap) => value })
  points!: PointMap;

  @Prop()
  isExist!: boolean;

  @Prop()
  onVacation!: boolean;
}

function transformPoint(value: PointGroup) {
  const initial = PointTypes.reduce((acc, cur) => ({ ...acc, [cur]: { sum: 0, logs: [] } }), {});
  return value.reduce((acc, cur) => ({ ...acc, [cur._id]: { sum: cur.sum, logs: cur.logs } }), initial);
}

export const SummaryModelDef: ModelDefinition = { name: Summary.name, schema: SchemaFactory.createForClass(Summary) };
