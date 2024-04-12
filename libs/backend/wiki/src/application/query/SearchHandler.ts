import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Ok, Result } from "ts-results-es";
import { VehicleRepo } from "../../domain";
import { Search, SearchResult } from "./Search";

@QueryHandler(Search)
export class SearchHandler implements IQueryHandler<Search, Result<SearchResult, string>> {

    @VehicleRepo()
    private readonly vehicleRepo!: VehicleRepo;

    async execute(query: Search): Promise<Result<SearchResult, string>> {
        const { name, limit, country, rank } = query.data;
        const searchResult = await this.vehicleRepo.searchByName(name, { country, rank }, { limit });
        if (searchResult.isErr()) return searchResult.mapErr(it => it.toString());
        const vehicles = searchResult.value;
        return Ok({
            vehicles: vehicles.map(vehicle => ({
                id: vehicle.props.id,
                name: vehicle.props.name,
                rank: vehicle.props.rank,
                country: vehicle.props.country,
            })),
        });
    }
}
