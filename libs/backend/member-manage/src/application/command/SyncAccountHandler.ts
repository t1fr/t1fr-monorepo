import { CommandHandler, type IInferredCommandHandler } from "@nestjs/cqrs";
import type { DomainError } from "@t1fr/backend/ddd-types";
import { Ok, Result } from "ts-results-es";
import { Account, AccountId, MemberRepo } from "../../domain";
import { SyncAccount } from "./SyncAccount";

@CommandHandler(SyncAccount)
export class SyncAccountHandler implements IInferredCommandHandler<SyncAccount> {
    @MemberRepo()
    private readonly memberRepo!: MemberRepo;

    async execute(command: SyncAccount): Promise<Result<void, DomainError>> {

        const dumpOrError = await this.memberRepo.dumpAccounts().promise;

        if (dumpOrError.isErr()) return dumpOrError;

        const existsMap = new Map(dumpOrError.value.map(it => [it.name, it]))

        await command.parse()
            .toAsyncResult()
            .andThen(accountData => Result.all(...accountData.map(({ id, ...other }) => {
                const existAccount = existsMap.get(other.name)
                if (existAccount) return Account.create(existAccount.id, other)
                else return Account.create(new AccountId(id), other);
            })))
            .andThen(accounts => this.memberRepo.saveAccounts(accounts))
            .promise;

        return Ok.EMPTY;
    }
}

