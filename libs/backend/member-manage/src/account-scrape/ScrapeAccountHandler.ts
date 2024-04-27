import { CommandHandler, IInferredCommandHandler } from "@nestjs/cqrs";
import { DomainError, UnexpectedError } from "@t1fr/backend/ddd-types";
import { Err, Result } from "ts-results-es";
import { MemberRepo } from "../domain";
import { AccountDataSource } from "./AccountDataSource";
import { ScrapeAccount, ScrapeAccountOutput } from "./ScrapeAccount";

@CommandHandler(ScrapeAccount)
export class ScrapeAccountHandler implements IInferredCommandHandler<ScrapeAccount> {

    @AccountDataSource()
    private readonly accountDataSource!: AccountDataSource;

    @MemberRepo()
    private readonly memberRepo!: MemberRepo;

    execute() {
        return this.memberRepo.dumpAccounts()
            .andThen(accounts => this.accountDataSource.fetch(accounts))
            .andThen(accounts => this.memberRepo.saveAccounts(accounts))
            .map(info => ({
                inserted: info.inserted,
                deleted: info.deleted,
                modified: info.modified,
                ids: info.ids.map(it => it.value),
            }))
            .promise;
    }
}


@CommandHandler(ScrapeAccount)
export class ScrapeAccountCommandToEvent implements IInferredCommandHandler<ScrapeAccount> {
    async execute(): Promise<Result<ScrapeAccountOutput, DomainError>> {
        return Err(UnexpectedError.create("尚未實作"));
    }
}