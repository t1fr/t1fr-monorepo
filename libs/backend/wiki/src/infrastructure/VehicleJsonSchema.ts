import { Country } from "../domain";

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
    type: string;
    normal_type: string;
    extended_type?: string[];
    obtainFrom?: string;
    cost_gold?: number;
    store?: string;
    operator_country?: string;
    squad?: boolean;
    marketplace?: string;
    event?: string;
}
