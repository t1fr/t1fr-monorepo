import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { WikiBotModule } from "../src/wiki-bot.module";

describe("WikiBotController (e2e)", () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [WikiBotModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it("/ (GET)", () => {
		return request(app.getHttpServer())
			.get("/")
			.expect(200)
			.expect("Hello World!");
	});
});