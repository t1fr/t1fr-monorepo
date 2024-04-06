import { Inject } from "@nestjs/common";
import { Season } from "./model/Season";
import { Result } from "ts-results-es";
import { DomainError } from "./model/DomainError";

export const SeasonRepo = () => Inject(SeasonRepo);

export interface SeasonRepo {
	save(season: Season): Promise<Result<void, DomainError>>;
}