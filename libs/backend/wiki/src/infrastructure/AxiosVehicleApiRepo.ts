import { Inject, Injectable, Provider } from "@nestjs/common";
import { Err, Ok, Result } from "ts-results-es";
import { BattleRating, DomainError, ObtainSource, Vehicle, VehicleApiRepo } from "../domain";
import { HttpService } from "@nestjs/axios";
import { DataResponse, VehicleJsonSchema } from "./VehicleJsonSchema";
import { Adapter } from "@t1fr/backend/ddd-types";

@Injectable()
export class AxiosVehicleApiRepo implements VehicleApiRepo, Adapter<Vehicle, VehicleJsonSchema, DomainError> {
  @Inject()
  private readonly httpService!: HttpService;

  private static readonly VehicleListUrl = "https://raw.githubusercontent.com/natgo/wt-data/main/data/final.json";

  async fromDatamine(currentVersion: string): Promise<Result<{
    vehicles: Vehicle[],
    version: string
  }, DomainError>> {
    const response = await this.httpService.axiosRef.get<DataResponse>(AxiosVehicleApiRepo.VehicleListUrl);
    if (!response || !response.data) return Err(DomainError.NoDatamineJsonResponse);
    const { version, ship, boat, army, helicopters, aviation } = response.data;
    if (version === currentVersion) return Err(DomainError.VersionNotChange);
    const vehicles = ship.concat(boat).concat(army).concat(helicopters).concat(aviation)
      .map(this.restore)
      .filter((result): result is Ok<Vehicle> => result.isOk())
      .map(result => result.value);

    return Ok({ vehicles, version });
  }

  persist(): Result<VehicleJsonSchema, DomainError> {
    throw Error("Shouldn't use this");
  }

  restore(model: VehicleJsonSchema): Result<Vehicle, DomainError> {
    const { intname: id, wikiname: name, extended_type, normal_type, operator_country, br, squad, obtainFrom, cost_gold: goldPrice, ...other } = model;
    const obtainSource = obtainFrom ?? (squad ? ObtainSource.Squad : ObtainSource.Techtree);
    const vehicleClasses = extended_type ? [normal_type, ...extended_type] : [normal_type];
    const [arcade, realistic, simulator] = br.map(parseFloat);
    const operator = operator_country ?? other.country;
    return BattleRating.create({ arcade, realistic, simulator })
      .andThen(battleRating => Vehicle.create({ ...other, id, name, operator, goldPrice, vehicleClasses, obtainSource, battleRating }));
  }
}


export const AxiosVehicleApiRepoProvide: Provider = { provide: VehicleApiRepo, useClass: AxiosVehicleApiRepo };
