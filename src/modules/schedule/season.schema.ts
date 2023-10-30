import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Account } from "@/modules/management/account/account.schema";

@Schema()
export class SquadStatistic {
	@Prop()
	groundKills: number;

	@Prop()
	airKills: number;

	@Prop()
	deaths: number;

	@Prop()
	wins: number;

	@Prop()
	battles: number;

	@Prop()
	period: number;
}

@Schema()
export class Squad {
	@Prop()
	position: number;

	@Prop()
	tag: string;

	@Prop()
	point: number;

	@Prop()
	statistic: SquadStatistic;
}

@Schema({ versionKey: false })
export class Season {
	@Prop()
	year: number;

	@Prop()
	season: number;

	@Prop()
	sections: Section[];

	@Prop()
	accounts: Account[];

	@Prop()
	finalPos: number;

	@Prop()
	top100squads: Squad[];
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
