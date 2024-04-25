import { CommandHandler, IInferredCommandHandler } from "@nestjs/cqrs";
import { AccountDataSource, MemberRepo } from "../../domain";
import { ScrapeAccount } from "./ScrapeAccount";

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