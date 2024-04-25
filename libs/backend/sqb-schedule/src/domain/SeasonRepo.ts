import { Inject } from "@nestjs/common";
import { AsyncActionResult } from "@t1fr/backend/ddd-types";
import { Season, SeasonId } from "./model/Season";

export const SeasonRepo = () => Inject(SeasonRepo);


export interface SeasonRepo {
    save(season: Season): AsyncActionResult<SeasonId>;

    findById(id: SeasonId): AsyncActionResult<Season>;

    findLatestSeason(): AsyncActionResult<Season>;
}