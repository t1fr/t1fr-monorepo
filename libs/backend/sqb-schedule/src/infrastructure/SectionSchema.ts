import { InjectModel, ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SqbMongooseConnection } from "./connection";

@Schema({ versionKey: false, collection: "sections" })
export class SectionSchema {
    @Prop()
    from!: Date;

    @Prop()
    to!: Date;

    @Prop()
    battleRating!: number;

    @Prop({ index: true })
    seasonIndex!: number;

    @Prop({ index: true })
    year!: number;
}

const sectionSchema = SchemaFactory.createForClass(SectionSchema);

sectionSchema.index({ from: -1, to: -1 }, { unique: true });

export const SectionModelDef: ModelDefinition = { name: SectionSchema.name, schema: sectionSchema };

export type SectionModel = Model<SectionSchema>

export const InjectSectionModel = () => InjectModel(SectionSchema.name, SqbMongooseConnection);