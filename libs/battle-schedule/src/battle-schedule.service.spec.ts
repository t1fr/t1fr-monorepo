import { Test, TestingModule } from "@nestjs/testing";
import { BattleScheduleService } from "./battle-schedule.service";

describe("BattleScheduleService", () => {
	let service: BattleScheduleService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [BattleScheduleService],
		}).compile();

		service = module.get<BattleScheduleService>(BattleScheduleService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
