import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Provider } from "@nestjs/common";
import { Adapter } from "@t1fr/backend/ddd-types";
import { chain, union } from "lodash";
import { Err, Ok, Result } from "ts-results-es";
import {
    BattleRating,
    DomainError,
    isValidCountry,
    isValidObtainSource,
    isValidType,
    isValidVehicleClass,
    ObtainSource,
    Vehicle,
    VehicleApiRepo,
} from "../domain";
import { DataResponse, VehicleJsonSchema } from "./VehicleJsonSchema";

@Injectable()
export class AxiosVehicleApiRepo implements VehicleApiRepo, Adapter<Vehicle, VehicleJsonSchema, DomainError> {
    @Inject()
    private readonly httpService!: HttpService;

    private static readonly VehicleListUrl = "https://raw.githubusercontent.com/natgo/wt-data/main/data/final.json";

    async fromDatamine(currentVersion: string): Promise<Result<{ vehicles: Vehicle[], version: string }, DomainError[]>> {
        const response = await this.httpService.axiosRef.get<DataResponse>(AxiosVehicleApiRepo.VehicleListUrl);
        if (!response || !response.data) return Err([DomainError.NoDatamineJsonResponse]);
        const { version, ship, boat, army, helicopters, aviation } = response.data;
        if (version === currentVersion) return Err([DomainError.VersionNotChange]);
        const [oks, errors] = chain(union(ship, boat, army, helicopters, aviation))
            .map(this.restore)
            .partition<Ok<Vehicle>>((it): it is Ok<Vehicle> => it.isOk())
            .value();

        const vehicles = oks.map(result => result.value);

        return errors.length ? Err(errors.map(it => it.error)) : Ok({ vehicles, version });
    }

    persist(): Result<VehicleJsonSchema, DomainError> {
        throw Error("Shouldn't use this");
    }

    restore(model: VehicleJsonSchema): Result<Vehicle, DomainError> {
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
        } = model;


        const obtainSource = obtainFrom ?? (squad ? ObtainSource.Squad : ObtainSource.Techtree);
        const unsureClasses = union([normal_type], extended_type);
        const vehicleClasses = unsureClasses.filter(isValidVehicleClass);
        const operator = operator_country ?? country;
        const [arcade, realistic, simulator] = br.map(parseFloat);

        if (!isValidCountry(country)) return Err(DomainError.UnknownVehicleCountry);
        if (!isValidCountry(operator)) return Err(DomainError.UnknownVehicleCountry);
        if (!isValidType(type)) return Err(DomainError.UnknownVehicleType);
        if (!isValidObtainSource(obtainSource)) return Err(DomainError.UnknownVehicleObtainWay);
        if (vehicleClasses.length < unsureClasses.length) return Err(DomainError.UnknownVehicleClass);

        return BattleRating.create({ arcade, realistic, simulator })
            .andThen(battleRating => Vehicle.create({
                ...other, country, type, id, name, operator, goldPrice, vehicleClasses, obtainSource, battleRating,
            }));
    }
}


export const AxiosVehicleApiRepoProvide: Provider = { provide: VehicleApiRepo, useClass: AxiosVehicleApiRepo };
