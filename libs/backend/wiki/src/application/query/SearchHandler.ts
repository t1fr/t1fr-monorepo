import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Search, SearchResult } from "./Search";
import { VehicleRepo } from "../../domain";
import { Ok, Result } from "ts-results-es";

@QueryHandler(Search)
export class SearchHandler implements IQueryHandler<Search, Result<SearchResult, string>> {

  @VehicleRepo()
  private readonly vehicleRepo!: VehicleRepo;

  async execute(query: Search): Promise<Result<SearchResult, string>> {
    const { name, limit, country, rank } = query.data;
    const searchResult = await this.vehicleRepo.searchByName(name, { country, rank }, { limit });
    if (searchResult.isErr()) return searchResult;
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
