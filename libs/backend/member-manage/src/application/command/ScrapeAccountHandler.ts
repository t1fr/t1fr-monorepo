import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AccountDataSource, MemberRepo } from "../../domain";
import { ScrapeAccount, ScrapeAccountOutput } from "./ScrapeAccount";

@CommandHandler(ScrapeAccount)
export class ScrapeAccountHandler implements ICommandHandler<ScrapeAccount, ScrapeAccountOutput> {

    @AccountDataSource()
    private readonly accountDataSource!: AccountDataSource;

    @MemberRepo()
    private readonly memberRepo!: MemberRepo;

    execute(): Promise<ScrapeAccountOutput> {
        return this.memberRepo.dumpAccounts()
            .andThen(accounts => this.accountDataSource.fetch(accounts))
            .andThen(accounts => this.memberRepo.saveAccounts(accounts))
            .map(info => ({
                inserted: info.inserted,
                deleted: info.deleted,
                modified: info.modified,
                insertedIds: [],
                deletedIds: [],
                modifiedIds: [],
            }))
            .promise;
    }
}