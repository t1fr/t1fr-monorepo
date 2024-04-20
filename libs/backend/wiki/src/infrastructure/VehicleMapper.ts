import { union } from "lodash";
import { BattleRating, ObtainSource, Vehicle } from "../domain";
import { VehicleJsonSchema } from "./VehicleJsonSchema";

export class VehicleMapper {

    static fromJsonSchema(data: VehicleJsonSchema): Vehicle {
        const {
            intname: id,
            wikiname: name,
            country,
            type,
            extended_type,
            normal_type,
            operator_country,
            br,
            squad,
            obtainFrom,
            cost_gold: goldPrice,
            ...other
        } = data;


        const obtainSource = obtainFrom ?? (squad ? ObtainSource.Squad : ObtainSource.Techtree);
        const vehicleClasses = union([normal_type], extended_type);
        const operator = operator_country ?? country;
        const [arcade, realistic, simulator] = br;
        const battleRating = BattleRating.rebuild({ arcade, realistic, simulator });
        return Vehicle.rebuild({ ...other, country, type, id, name: name ?? id, operator, goldPrice, vehicleClasses, obtainSource, battleRating });
    }
}