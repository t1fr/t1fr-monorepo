import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ _id: false })
export class VehicleBattleRating {
	@Prop({ type: Types.Decimal128 })
	arcade: number;

	@Prop({ type: Types.Decimal128 })
	realistic: number;

	@Prop({ type: Types.Decimal128 })
	simulator: number;
}

const ObtainWays = ["gift", "marketplace", "store", "gold"] as const;

type ObtainFrom = (typeof ObtainWays)[number];

@Schema()
export class Vehicle {
	@Prop({ unique: true })
	key: string;

	@Prop({ index: "text" })
	name: string;

	@Prop({ type: VehicleBattleRating })
	br: VehicleBattleRating;

	@Prop()
	country: string;

	@Prop()
	operator: string;

	@Prop()
	operatorImageUrl: string;

	@Prop()
	rank: number;

	@Prop()
	type: string;

	@Prop()
	normal_type: string;

	@Prop()
	extended_type?: string[];

	@Prop({ enum: ObtainWays })
	obtainFrom?: ObtainFrom;

	@Prop()
	cost_gold?: number;

	@Prop()
	store: string;

	@Prop()
	squad: boolean;

	@Prop()
	marketplace: string;

	@Prop()
	event: string;

}

export const VehicleModelDef: ModelDefinition = { name: Vehicle.name, schema: SchemaFactory.createForClass(Vehicle) };