import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Season {
	@Prop()
	year: number;

	@Prop()
	season: number;

	@Prop()
	sections: Section[];
}

@Schema()
export class Section {
	@Prop()
	from: Date;

	@Prop()
	to: Date;

	@Prop()
	battleRating: number;
}

export const SeasonModelDef = { name: Season.name, schema: SchemaFactory.createForClass(Season) };
