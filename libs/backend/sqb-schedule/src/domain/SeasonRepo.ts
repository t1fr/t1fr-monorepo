import { Inject } from "@nestjs/common";
import { DomainError } from "@t1fr/backend/ddd-types";
import { AsyncResult } from "ts-results-es";
import { Season, SeasonId } from "./model/Season";

export const SeasonRepo = () => Inject(SeasonRepo);

export type SeasonRepoResult<T> = AsyncResult<T, DomainError>

export interface SeasonRepo {
    save(season: Season): SeasonRepoResult<void>;

    findById(id: SeasonId): SeasonRepoResult<Season>;
}