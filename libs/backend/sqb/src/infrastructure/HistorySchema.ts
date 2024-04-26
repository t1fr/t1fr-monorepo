import { InjectModel, ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SqbMongooseConnection } from "./connection";

export class PerformanceSchema {
    @Prop()
    groundKills!: number;

    @Prop()
    airKills!: number;

    @Prop()
    deaths!: number;

    @Prop()
    wins!: number;

    @Prop()
    battles!: number;

    @Prop()
    period!: number;
}

export class SquadSchema {
    @Prop()
    id!: number;

    @Prop()
    position!: number;

    @Prop()
    tag!: string;

    @Prop()
    point!: number;

    @Prop()
    performance!: PerformanceSchema;
}

@Schema({ collection: "histories" })
export class HistorySchema {
    @Prop()
    year!: number;

    @Prop()
    seasonIndex!: number;

    @Prop()
    top100!: SquadSchema[];

    @Prop({ type: Number })
    finalPos!: number | null;
}

export const HistoryModelDef: ModelDefinition = { name: HistorySchema.name, schema: SchemaFactory.createForClass(HistorySchema) };
export const InjectHistoryModel = () => InjectModel(HistorySchema.name, SqbMongooseConnection);

export type HistoryModel = Model<HistorySchema>;
