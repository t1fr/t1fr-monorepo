import { QueryHandler, type IInferredQueryHandler } from "@nestjs/cqrs";
import type { DomainError } from "@t1fr/backend/ddd-types";
import type { Result } from "ts-results-es";
import { SquadronMatchRepo } from "../../domain";
import { SearchMatchRecords, type SearchMatchRecordsOutput } from "./SearchMatchRecords";

@QueryHandler(SearchMatchRecords)
export class SearchMatchRecordsHandler implements IInferredQueryHandler<SearchMatchRecords> {
    @SquadronMatchRepo()
    private readonly squadronMatchRepo!: SquadronMatchRepo

    execute(query: SearchMatchRecords): Promise<Result<SearchMatchRecordsOutput, DomainError>> {
        return query.parse()
            .toAsyncResult()
            .andThen(({ br, enemyName, ourName }) => this.squadronMatchRepo.findByEnemyNameAndBr(br, ourName, enemyName))
            .promise
    }
}