import { InjectModel, ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SqbMongooseConnection } from "./connection";

@Schema({ _id: false })
export class SectionSchema {
    @Prop()
    from!: Date;

    @Prop()
    to!: Date;

    @Prop()
    battleRating!: number;
}

@Schema({ versionKey: false, collection: "seasons" })
export class SeasonSchema {
    @Prop()
    year!: number;

    @Prop()
    seasonIndex!: number;

    @Prop()
    sections!: SectionSchema[];
}

const seasonSchema = SchemaFactory.createForClass(SeasonSchema);

seasonSchema.index({ year: 1, seasonIndex: 1 }, { unique: true });

export const SeasonModelDef: ModelDefinition = { name: SeasonSchema.name, schema: seasonSchema };

export type SeasonModel = Model<SeasonSchema>

export const InjectSeasonModel = () => InjectModel(SeasonSchema.name, SqbMongooseConnection);