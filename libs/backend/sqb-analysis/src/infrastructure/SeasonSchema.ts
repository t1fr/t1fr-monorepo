import { InjectModel, ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Schema()
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

@Schema({ collection: "seasons" })
export class SeasonSchema {
	@Prop()
	year!: number;

	@Prop()
	season!: number;

	@Prop()
	top100!: SquadSchema[];

	@Prop()
	finalPos!: number | null;
}


export const SeasonModelDef: ModelDefinition = { name: SeasonSchema.name, schema: SchemaFactory.createForClass(SeasonSchema) };
export const InjectSeasonModel = () => InjectModel(SeasonSchema.name);

export type SeasonModel = Model<SeasonSchema>;
