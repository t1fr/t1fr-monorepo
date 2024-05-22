import { InjectModel, type ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SqbMongooseConnection } from "./connection";

export class PlayerSchema {
    @Prop()
    id!: string;

    @Prop()
    vehicle!: string;
}

@Schema({ collection: "squadron-matches", versionKey: false })
export class SquadronMatchSchema {
    @Prop()
    _id!: string;

    @Prop({ type: [Number] })
    timeSeries!: number[];

    @Prop()
    timestamp!: Date;

    @Prop()
    battleRating!: string;

    @Prop()
    enemyName?: string;

    @Prop()
    isVictory?: boolean

    @Prop({ type: [PlayerSchema] })
    ourTeam!: PlayerSchema[]

    @Prop({ type: [PlayerSchema] })
    enemyTeam!: PlayerSchema[]
}

export const SquadronMatchModelDef: ModelDefinition = { name: SquadronMatchSchema.name, schema: SchemaFactory.createForClass(SquadronMatchSchema) };
export const InjectSquadronMatchModel = () => InjectModel(SquadronMatchSchema.name, SqbMongooseConnection);

export type SquadronMatchModel = Model<SquadronMatchSchema>;
