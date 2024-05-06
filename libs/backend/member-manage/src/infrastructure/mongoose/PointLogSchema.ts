import { InjectModel, type ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PointType } from "../../domain";
import { MemberManageMongooseConnection, MemberSchemaRefToken, PointLogSchemaRefToken } from "./connection";
import type { MemberSchema } from "./MemberSchema";

@Schema({ collection: "pointLogs", versionKey: false, timestamps: { createdAt: "date", updatedAt: false } })
export class PointLogSchema {
    @Prop()
    memberId!: string;

    @Prop()
    category!: string;

    @Prop()
    delta!: Types.Decimal128;

    @Prop()
    comment!: string;

    @Prop({ type: String })
    type!: PointType;

    date!: Date;

    member!: MemberSchema | null;
}

const pointLogSchema = SchemaFactory.createForClass(PointLogSchema);

pointLogSchema.virtual("member", { ref: MemberSchemaRefToken, localField: "memberId", foreignField: "discordId", justOne: true });

export type PointLogModel = Model<PointLogSchema>
export const PointLogModelDef: ModelDefinition = { name: PointLogSchemaRefToken, schema: pointLogSchema };
export const InjectPointLogModel = () => InjectModel(PointLogSchemaRefToken, MemberManageMongooseConnection);
