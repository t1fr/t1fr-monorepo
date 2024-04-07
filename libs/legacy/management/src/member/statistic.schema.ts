import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { PointType } from "../point";
import { Member } from "./member.schema";

@Schema({ autoCreate: false, collection: "statistics" })
export class Statistic implements Omit<Member, "isExist"> {
  @Prop({ type: SchemaTypes.Mixed })
  points!: { [type in PointType]: number };

  @Prop()
  _id!: string;

  @Prop()
  avatarUrl!: string;

  @Prop()
  isOfficer!: boolean;

  @Prop()
  nickname!: string;

  @Prop()
  noAccount!: boolean;
}

export const StatisticModelDef: ModelDefinition = { name: Statistic.name, schema: SchemaFactory.createForClass(Statistic) };
