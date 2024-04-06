import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SnapshotSeason } from "./SnapshotSeason";
import { Inject } from "@nestjs/common";
import { Season, SeasonId, SeasonRepo, Squad } from "../../domain";
import { SquadDataScraper } from "../../infrastructure";
import { range } from "lodash";

@CommandHandler(SnapshotSeason)
export class SnapshotSeasonHandler implements ICommandHandler<SnapshotSeason> {

	@Inject()
	private readonly scraper: SquadDataScraper;

	@SeasonRepo()
	private readonly repo: SeasonRepo;

	async execute() {
		const now = new Date();
		const year = now.getFullYear();
		const seasonIndex = now.getMonth() / 2 + 1;
		const id = new SeasonId({ year, season: seasonIndex });
		const top100 = new Array<Squad>();
		for (const i of range(1, 11)) {
			const squads = await this.scraper.scrap(i);
			top100.push(...squads.value);
		}

		const season = Season.create(id, { top100 }).value;
		if (season.findPos) return;

		for (const i of range(11, 21)) {
			const squads = await this.scraper.scrap(i);
			const result = season.searchPos(squads.value);
			if (result.isOk()) break;
		}
	}

}