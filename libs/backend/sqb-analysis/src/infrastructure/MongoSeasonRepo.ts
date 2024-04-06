import { Injectable } from "@nestjs/common";
import { DomainError, Season, SeasonRepo } from "../domain";
import { Ok, Result } from "ts-results-es";
import { InjectSeasonModel, SeasonModel } from "./SeasonSchema";
import { SeasonAdapter } from "./SeasonAdapter";
import { AdapterError } from "@t1fr/backend/ddd-types";

@Injectable()
export class MongoSeasonRepo implements SeasonRepo {

	@InjectSeasonModel()
	private readonly seasonModel!: SeasonModel;

	private static readonly seasonAdapter = new SeasonAdapter();

	async save(season: Season): Promise<Result<void, DomainError>> {
		return MongoSeasonRepo.seasonAdapter.persist(season)
			.toAsyncResult()
			.andThen(async seasonSchema => {
				await this.seasonModel.updateOne({ year: seasonSchema.year, season: seasonSchema.season }, seasonSchema, { upsert: true });
				return Ok.EMPTY;
			})
			.mapErr(() => AdapterError.PersistError).promise;
	}
}