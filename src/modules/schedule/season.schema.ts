import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Account } from "@/modules/management/account/account.schema";

@Schema()
export class Season {
	@Prop()
	year: number;

	@Prop()
	season: number;

	@Prop()
	sections: Section[];

	@Prop()
	accounts: Account[];
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
