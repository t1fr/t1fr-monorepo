import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Err, Ok, Result } from "ts-results-es";
import { VehicleRepo } from "../../domain";
import { FindById, FindByIdOutput } from "./FindById";

@QueryHandler(FindById)
export class FindByIdHandler implements IQueryHandler<FindById, Result<FindByIdOutput, string>> {


    @VehicleRepo()
    private readonly vehicleRepo!: VehicleRepo;

    async execute(query: FindById): Promise<Result<FindByIdOutput, string>> {
        const findByIdOrError = await this.vehicleRepo.findById(query.data.id);
        if (findByIdOrError.isErr()) return findByIdOrError.mapErr(it => it.toString());
        const vehicle = findByIdOrError.value;
        const { type, name, rank, country, battleRating, operator, vehicleClasses } = vehicle.props;
        const basicInfo = {
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
        };

        if (vehicle.isStoreVehicle()) {
            return Ok({ vehicle: { ...basicInfo, obtainSource: vehicle.props.obtainSource, storeUrl: vehicle.storeUrl } });
        } else if (vehicle.isGiftVehicle()) {
            return Ok({ vehicle: { ...basicInfo, obtainSource: vehicle.props.obtainSource, event: vehicle.props.event } });
        } else if (vehicle.isMarketplaceVehicle()) {
            return Ok({
                vehicle: {
                    ...basicInfo,
                    obtainSource: vehicle.props.obtainSource,
                    marketplaceUrl: vehicle.marketplaceUrl,
                    event: vehicle.props.event,
                },
            });
        } else if (vehicle.isGoldVehicle()) {
            return Ok({ vehicle: { ...basicInfo, obtainSource: vehicle.props.obtainSource, goldPrice: vehicle.props.goldPrice } });
        } else if (vehicle.isNormalVehicle()) {
            return Ok({ vehicle: { ...basicInfo, obtainSource: vehicle.props.obtainSource } });
        } else {
            return Err("shouldn't be here");
        }

    }

}
