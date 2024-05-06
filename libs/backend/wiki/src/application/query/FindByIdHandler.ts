import { type IInferredQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { VehicleRepo } from "../../domain";
import { FindById } from "./FindById";

@QueryHandler(FindById)
export class FindByIdHandler implements IInferredQueryHandler<FindById> {
    @VehicleRepo()
    private readonly vehicleRepo!: VehicleRepo;

    async execute(query: FindById) {
        return query.parse()
            .toAsyncResult()
            .andThen(({ id }) => this.vehicleRepo.findById(id))
            .map(vehicle => {

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
                    return { vehicle: { ...basicInfo, obtainSource: vehicle.props.obtainSource, storeUrl: vehicle.storeUrl } };
                } else if (vehicle.isGiftVehicle()) {
                    return { vehicle: { ...basicInfo, obtainSource: vehicle.props.obtainSource, event: vehicle.props.event } };
                } else if (vehicle.isMarketplaceVehicle()) {
                    return {
                        vehicle: {
                            ...basicInfo,
                            obtainSource: vehicle.props.obtainSource,
                            marketplaceUrl: vehicle.marketplaceUrl,
                            event: vehicle.props.event,
                        },
                    };
                } else if (vehicle.isGoldVehicle()) {
                    return { vehicle: { ...basicInfo, obtainSource: vehicle.props.obtainSource, goldPrice: vehicle.props.goldPrice } };
                } else if (vehicle.isNormalVehicle()) {
                    return { vehicle: { ...basicInfo, obtainSource: vehicle.props.obtainSource } };
                } else {
                    throw Error("shouldn't reach here");
                }

            })
            .promise;

    }

}
