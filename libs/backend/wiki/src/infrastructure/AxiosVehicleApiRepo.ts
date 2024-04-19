import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Provider } from "@nestjs/common";
import { chain, union } from "lodash";
import { Err, Ok } from "ts-results-es";
import { ScapeDataMineResult, ScrapeVehicleError, VehicleApiRepo } from "../domain";
import { DataResponse } from "./VehicleJsonSchema";
import { VehicleMapper } from "./VehicleMapper";

@Injectable()
export class AxiosVehicleApiRepo implements VehicleApiRepo {
    @Inject()
    private readonly httpService!: HttpService;

    private static readonly VehicleListUrl = "https://raw.githubusercontent.com/natgo/wt-data/main/data/final.json";

    async fromDatamine(currentVersion: string): Promise<ScapeDataMineResult> {
        const response = await this.httpService.axiosRef.get(AxiosVehicleApiRepo.VehicleListUrl);
        if (!response || !response.data) return Err(new ScrapeVehicleError.NoJsonResponseError());

        const parseDataOrError = DataResponse.safeParse(response.data);
        if (!parseDataOrError.success) return Err(new ScrapeVehicleError.ParseDataError(parseDataOrError.error.toString()));
        const { version, ship, boat, army, helicopters, aviation } = parseDataOrError.data;
        if (version === currentVersion) return Err(new ScrapeVehicleError.VersionNotChangeError(version));
        const vehicles = chain(union(ship, boat, army, helicopters, aviation))
            .map(VehicleMapper.fromJsonSchema)
            .value();

        return Ok({ vehicles, version });
    }

}


export const AxiosVehicleApiRepoProvide: Provider = { provide: VehicleApiRepo, useClass: AxiosVehicleApiRepo };
