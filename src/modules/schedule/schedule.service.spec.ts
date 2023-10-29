import { ScheduleService } from "@/modules/schedule/schedule.service";
import { Test } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { Season } from "@/modules/schedule/season.schema";
import { ConnectionName } from "@/constant";
import { Model } from "mongoose";
import { AccountService } from "@/modules/management/account/account.service";
import { Client } from "discord.js";
import dayjs from 'dayjs'
import customParse from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'

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