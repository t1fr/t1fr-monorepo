import { InjectModel, ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Country, ObtainSource, Type, VehicleClass } from "../domain";

function decimalTransformer(value: Types.Decimal128) {
	return parseFloat(value.toString());
}

@Schema({ _id: false })
export class BattleRatingSchema {
	@Prop({ type: Types.Decimal128, transform: decimalTransformer })
	arcade: number;

	@Prop({ type: Types.Decimal128, transform: decimalTransformer })
	realistic: number;

	@Prop({ type: Types.Decimal128, transform: decimalTransformer })
	simulator: number;
}


@Schema({ collection: "vehicles", versionKey: false })
export class VehicleSchema {
	@Prop({ unique: true })
	_id: string;

	@Prop({ index: "text" })
	name: string;

	@Prop({ type: BattleRatingSchema })
	battleRating: BattleRatingSchema;

	@Prop({ type: String, enum: Country })
	country: Country;

	@Prop({ type: String, enum: Country })
	operator: Country;

	@Prop()
	rank: number;

	@Prop({ type: String, enum: Type })
	type: Type;

	@Prop({ type: [String] })
	vehicleClasses: VehicleClass[];

	@Prop({ enum: ObtainSource, type: String })
	obtainSource: ObtainSource;

	@Prop()
	goldPrice?: number;

	@Prop()
	store?: string;

	@Prop()
	marketplace?: string;

	@Prop()
	event?: string;
}

export const VehicleModelDef: ModelDefinition = { name: VehicleSchema.name, schema: SchemaFactory.createForClass(VehicleSchema) };
export type VehicleModel = Model<VehicleSchema>;
export const InjectVehicleModel = () => InjectModel(VehicleSchema.name);