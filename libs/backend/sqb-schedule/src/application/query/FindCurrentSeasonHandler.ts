import { IInferredQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DomainError } from "@t1fr/backend/ddd-types";
import { Result } from "ts-results-es";
import { SectionRepo } from "../../domain";
import { FindCurrentSeason, FindCurrentSeasonOutput } from "./FindCurrentSeason";

@QueryHandler(FindCurrentSeason)
export class FindCurrentSeasonHandler implements IInferredQueryHandler<FindCurrentSeason> {
    @SectionRepo()
    private readonly seasonRepo!: SectionRepo;

    execute(): Promise<Result<FindCurrentSeasonOutput, DomainError>> {
        return this.seasonRepo
            .findSeason(new Date())
            .map(sections => {
                const { year, seasonIndex } = sections[0].meta;
                return {
                    year, seasonIndex,
                    sections: sections.map(it => ({
                        to: it.to,
                        from: it.from,
                        battleRating: it.battleRating,
                    })),
                };
            })
            .promise;
    }

}