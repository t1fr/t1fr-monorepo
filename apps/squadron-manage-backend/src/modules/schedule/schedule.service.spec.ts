import { Test } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Client } from "discord.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParse from "dayjs/plugin/customParseFormat";
import { ScheduleService } from "./schedule.service";
import { Season } from "./season.schema";
import { AccountService } from "../management";
import { ConnectionName } from "../../constant";

dayjs.extend(customParse);
dayjs.extend(utc);

describe(ScheduleService.name, () => {
	let service: ScheduleService;

	const mockSeasonModel: Partial<Model<Season>> = {
		findOneAndUpdate: jest.fn(),
		findOne: jest.fn(),
		aggregate: jest.fn(),
	};

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				ScheduleService,
				{ provide: AccountService, useValue: {} },
				{ provide: Client, useValue: {} },
				{ provide: getModelToken(Season.name, ConnectionName.Management), useValue: mockSeasonModel },
			],
		}).compile();
		service = await module.resolve<ScheduleService>(ScheduleService);
	});

	describe("是否為本月最後一日", () => {
		it("", () => {
			const result = service.isLastDayOfMonth(new Date());
			expect(result).toBe(false);
		});
	});
});