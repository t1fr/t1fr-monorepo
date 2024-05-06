import { type IInferredQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DomainError } from "@t1fr/backend/ddd-types";
import { Result } from "ts-results-es";
import { SectionRepo } from "../../domain";
import { FindCurrentSeason } from "./FindCurrentSeason";
import type { Season } from "./Season";
import { SeasonMapper } from "./SeasonMapper";

@QueryHandler(FindCurrentSeason)
export class FindCurrentSeasonHandler implements IInferredQueryHandler<FindCurrentSeason> {
    @SectionRepo()
    private readonly seasonRepo!: SectionRepo;

    execute(): Promise<Result<Season, DomainError>> {
        return this.seasonRepo.findSeason(new Date()).map(sections => SeasonMapper.fromSections(sections)).promise;
    }
}
