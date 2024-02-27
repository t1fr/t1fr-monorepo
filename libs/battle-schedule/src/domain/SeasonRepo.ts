import { Season } from "@app/battle-schedule/domain/model/Season";

export const SeasonRepo = Symbol("SeasonRepo");

export interface SeasonRepo {
	save(season: Season): Promise<void>;
}