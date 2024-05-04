import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Provider } from "@nestjs/common";
import { AsyncActionResult, ZodParseError } from "@t1fr/backend/ddd-types";
import _ from "lodash-es";
import { AsyncResult, Err, Ok } from "ts-results-es";
import { ScrapeVehicleError, Vehicle, VehicleApiRepo } from "../domain";
import { DataResponse } from "./VehicleJsonSchema";
import { VehicleMapper } from "./VehicleMapper";

@Injectable()
export class AxiosVehicleApiRepo implements VehicleApiRepo {
    @Inject()
    private readonly httpService!: HttpService;

    private static readonly VehicleListUrl = "https://raw.githubusercontent.com/natgo/wt-data/main/data/final.json";

    fromDatamine(currentVersion: string): AsyncActionResult<{ vehicles: Vehicle[]; version: string }> {
        const promise = this.httpService.axiosRef.get(AxiosVehicleApiRepo.VehicleListUrl).then(response => {
            if (!response || !response.data) return Err(new ScrapeVehicleError.NoJsonResponseError());
            const parseDataOrError = DataResponse.safeParse(response.data);
            if (!parseDataOrError.success) return Err(ZodParseError.create(parseDataOrError.error));
            const { version, ship, boat, army, helicopters, aviation } = parseDataOrError.data;
            if (version === currentVersion) return Err(new ScrapeVehicleError.VersionNotChangeError(version));
            const vehicles = _.chain(_.union(ship, boat, army, helicopters, aviation))
                .map(VehicleMapper.fromJsonSchema)
                .value();
            return Ok({ vehicles, version });
        });

        return new AsyncResult(promise);
    }
}


export const AxiosVehicleApiRepoProvide: Provider = { provide: VehicleApiRepo, useClass: AxiosVehicleApiRepo };
