import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Provider } from "@nestjs/common";
import { chain, union } from "lodash";
import { Err, Ok } from "ts-results-es";
import { ScapeDataMineResult, ScrapeVehicleError, Vehicle, VehicleApiRepo } from "../domain";
import { VehicleMapper } from "../mapper";
import { DataResponse } from "./VehicleJsonSchema";

@Injectable()
export class AxiosVehicleApiRepo implements VehicleApiRepo {
    @Inject()
    private readonly httpService!: HttpService;

    private static readonly VehicleListUrl = "https://raw.githubusercontent.com/natgo/wt-data/main/data/final.json";

    async fromDatamine(currentVersion: string): Promise<ScapeDataMineResult> {
        const response = await this.httpService.axiosRef.get<DataResponse>(AxiosVehicleApiRepo.VehicleListUrl);
        if (!response || !response.data) return Err(new ScrapeVehicleError.NoJsonResponseError());
        const { version, ship, boat, army, helicopters, aviation } = response.data;
        if (version === currentVersion) return Err(new ScrapeVehicleError.VersionNotChangeError(version));
        const [oks, errors] = chain(union(ship, boat, army, helicopters, aviation))
            .map(it => VehicleMapper.fromJsonSchemaToDomain(it))
            .partition<Ok<Vehicle>>((it): it is Ok<Vehicle> => it.isOk())
            .value();

        if (errors.length > 0) {
            return Err(new ScrapeVehicleError.UnknownPropertyKeyError(errors.map(it => it.error)));
        } else {
            const vehicles = oks.map(result => result.value);
            return Ok({ vehicles, version });
        }
    }
}


export const AxiosVehicleApiRepoProvide: Provider = { provide: VehicleApiRepo, useClass: AxiosVehicleApiRepo };
