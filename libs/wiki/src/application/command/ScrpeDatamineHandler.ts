import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ScapeDatamine } from "./ScapeDatamine";
import { VehicleApiRepo, VehicleRepo } from "../../domain";
import { Ok } from "ts-results-es";

@CommandHandler(ScapeDatamine)
export class ScrpeDatamineHandler implements ICommandHandler<ScapeDatamine> {

	@VehicleApiRepo()
	private readonly apiRepo: VehicleApiRepo;

	@VehicleRepo()
	private readonly vehicleRepo: VehicleRepo;

	private static version = "";
	async execute() {
		const scrpeResult = await this.apiRepo.fromDatamine(ScrpeDatamineHandler.version);
		if (scrpeResult.isErr()) return scrpeResult;
		const { version, vehicles } = scrpeResult.value;
		ScrpeDatamineHandler.version = version;
		await this.vehicleRepo.save(vehicles);
		return Ok(vehicles.length);
	}
}