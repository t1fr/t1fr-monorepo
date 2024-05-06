import { type IInferredQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DomainError } from "@t1fr/backend/ddd-types";
import { Result } from "ts-results-es";
import { SectionRepo } from "../../domain";
import { FindCurrentSection, type FindCurrentSectionOutput } from "./FindCurrentSection";

@QueryHandler(FindCurrentSection)
export class FindCurrentSectionHandler implements IInferredQueryHandler<FindCurrentSection> {
    @SectionRepo()
    private readonly seasonRepo!: SectionRepo;

    execute(): Promise<Result<FindCurrentSectionOutput, DomainError>> {
        const now = new Date();
        return this.seasonRepo.findOngoingSection(now).promise;
    }
}
