import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { VehicleApiRepo, VehicleRepo } from "../../domain";
import { ScapeDatamine } from "./ScapeDatamine";

@CommandHandler(ScapeDatamine)
export class ScrpeDatamineHandler implements ICommandHandler<ScapeDatamine> {

    @VehicleApiRepo()
    private readonly apiRepo!: VehicleApiRepo;

    @VehicleRepo()
    private readonly vehicleRepo!: VehicleRepo;

    private static version = "";

    async execute() {
        const scrpeResult = await this.apiRepo.fromDatamine(ScrpeDatamineHandler.version);
        if (scrpeResult.isErr()) return scrpeResult.mapErr(err => err.toString());
        const { version, vehicles } = scrpeResult.value;
        ScrpeDatamineHandler.version = version;
        return this.vehicleRepo.save(vehicles);
    }
}
