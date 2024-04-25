import { IInferredQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DomainError } from "@t1fr/backend/ddd-types";
import { Result } from "ts-results-es";
import { SeasonRepo } from "../../domain";
import { FindCurrentSeason, FindCurrentSeasonOutput } from "./FindCurrentSeason";

@QueryHandler(FindCurrentSeason)
export class FindCurrentSeasonHandler implements IInferredQueryHandler<FindCurrentSeason> {
    @SeasonRepo()
    private readonly seasonRepo!: SeasonRepo;

    execute(): Promise<Result<FindCurrentSeasonOutput, DomainError>> {
        return this.seasonRepo.findLatestSeason()
            .map(season => ({
                year: season.year,
                seasonIndex: season.seasonIndex,
                sections: season.sections.map(it => ({
                    to: it.to,
                    from: it.from,
                    battleRating: it.battleRating,
                })),
            }))
            .promise;
    }

}