import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ZodParseError } from "@t1fr/backend/ddd-types";
import { Err } from "ts-results-es";
import { MemberRepo } from "../../domain";
import { SearchAccount, SearchAccountInput, SearchAccountResult } from "./SearchAccount";

@QueryHandler(SearchAccount)
export class SearchAccountHandler implements IQueryHandler<SearchAccount, SearchAccountResult> {
    @MemberRepo()
    private readonly memberRepo!: MemberRepo;

    async execute(query: SearchAccount): Promise<SearchAccountResult> {
        const parseOrError = SearchAccountInput.safeParse(query.data);
        if (!parseOrError.success) return Err(ZodParseError.create(parseOrError.error));

        return this.memberRepo.searchAccountByName(parseOrError.data.name).promise;
    }
}