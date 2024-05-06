import { type IInferredQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DomainError } from "@t1fr/backend/ddd-types";
import { Result } from "ts-results-es";
import { SectionRepo } from "../../domain";
import { GetLatestSeason } from "./GetLatestSeason";
import type { Season } from "./Season";
import { SeasonMapper } from "./SeasonMapper";

@QueryHandler(GetLatestSeason)
export class GetLatestSeasonHandler implements IInferredQueryHandler<GetLatestSeason> {
    @SectionRepo()
    private readonly seasonRepo!: SectionRepo;

    execute(): Promise<Result<Season, DomainError>> {
        return this.seasonRepo.findLatestSeason()
            .map(sections => SeasonMapper.fromSections(sections))
            .promise;
    }
}
