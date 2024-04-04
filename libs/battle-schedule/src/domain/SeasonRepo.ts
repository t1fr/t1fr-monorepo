import { Season, SeasonId } from "./model/Season";
import { Inject } from "@nestjs/common";
import { Ok, Result } from "ts-results-es";

export const SeasonRepo = () => Inject(SeasonRepo);

export interface SeasonRepo {
	save(season: Season): Promise<Ok<void>>;
	findById(id: SeasonId): Promise<Result<Season, "NOT_FOUND">>;
}