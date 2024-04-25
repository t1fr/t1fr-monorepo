import { IInferredQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { VehicleRepo } from "../../domain";
import { Search } from "./Search";

@QueryHandler(Search)
export class SearchHandler implements IInferredQueryHandler<Search> {

    @VehicleRepo()
    private readonly vehicleRepo!: VehicleRepo;

    async execute(query: Search) {
        return query.parse()
            .toAsyncResult()
            .andThen(({ name, limit, country, rank }) => this.vehicleRepo.searchByName({ name, country, rank }, { limit }))
            .map(vehicles => ({
                vehicles: vehicles.map(vehicle => ({
                    id: vehicle.props.id,
                    name: vehicle.props.name,
                    rank: vehicle.props.rank,
                    country: vehicle.props.country,
                })),
            }))
            .promise;
    }
}
