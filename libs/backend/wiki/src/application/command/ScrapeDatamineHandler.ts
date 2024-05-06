import { CommandHandler, type IInferredCommandHandler } from "@nestjs/cqrs";
import { VehicleApiRepo, VehicleRepo } from "../../domain";
import { ScrapeDatamine } from "./ScrapeDatamine";

@CommandHandler(ScrapeDatamine)
export class ScrapeDatamineHandler implements IInferredCommandHandler<ScrapeDatamine> {

    @VehicleApiRepo()
    private readonly apiRepo!: VehicleApiRepo;

    @VehicleRepo()
    private readonly vehicleRepo!: VehicleRepo;

    private static version = "";

    async execute() {
        return this.apiRepo
            .fromDatamine(ScrapeDatamineHandler.version)
            .andThen(({ version, vehicles }) => {
                ScrapeDatamineHandler.version = version;
                return this.vehicleRepo.save(vehicles);
            })
            .promise;
    }
}
