import { Country, ObtainSource, Type, VehicleClass } from "../domain";

export interface DataResponse {
	version: string;
	army: VehicleJsonSchema[];
	aviation: VehicleJsonSchema[];
	helicopters: VehicleJsonSchema[];
	ship: VehicleJsonSchema[];
	boat: VehicleJsonSchema[];
}

// noinspection SpellCheckingInspection
export interface VehicleJsonSchema {
	intname: string;
	wikiname: string;
	country: Country;
	rank: number;
	br: string[];
	type: Type;
	normal_type: VehicleClass;
	extended_type?: VehicleClass[];
	obtainFrom?: ObtainSource;
	cost_gold?: number;
	store?: string;
	operator_country?: Country;
	squad?: boolean;
	marketplace?: string;
	event?: string;
}
