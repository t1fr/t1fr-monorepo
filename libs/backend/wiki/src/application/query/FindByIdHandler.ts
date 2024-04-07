import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindById, FindByIdResult } from "./FindById";
import { Ok, Result } from "ts-results-es";
import { VehicleRepo } from "../../domain";

@QueryHandler(FindById)
export class FindByIdHandler implements IQueryHandler<FindById, Result<FindByIdResult, string>> {


    @VehicleRepo()
    private readonly vehicleRepo!: VehicleRepo;

    async execute(query: FindById): Promise<Result<FindByIdResult, string>> {
        const result = await this.vehicleRepo.findById(query.data.id);
        if (result.isErr()) return result;
        const vehicle = result.value;
        const { type, name, rank, country, battleRating, obtainSource, operator, vehicleClasses, event, goldPrice } = vehicle.props;
        return Ok({
            vehicle: {
                battleRating: battleRating.toObject(),
                name: name,
                wikiUrl: vehicle.wikiUrl,
                country,
                rank,
                operator,
                imageUrl: vehicle.flagUrl,
                thumbnailUrl: vehicle.thumbnailUrl,
                type,
                classes: vehicleClasses,
                obtainSource: obtainSource,
                storeUrl: vehicle.storeUrl,
                marketplaceUrl: vehicle.marketplaceUrl,
                event,
                goldPrice,
            },
        });

    }

}
