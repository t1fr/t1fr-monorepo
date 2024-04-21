import { Inject } from "@nestjs/common";
import { DomainError } from "@t1fr/backend/ddd-types";
import { AsyncResult } from "ts-results-es";
import { Account, AccountId, Member, MemberId } from "../model";

export const MemberRepo = () => Inject(MemberRepo);

export type ValueOrArray<I, O> = I extends unknown[] ? O[] : O

export type MemberRepoResult<T> = AsyncResult<T, DomainError>

export type SaveAccountsResult = { inserted: number, deleted: number, modified: number }

export interface MemberRepo {
    save<T extends Member | Member[]>(data: T): MemberRepoResult<ValueOrArray<T, Member>>;

    findMemberHaveAccount(accountId: AccountId): MemberRepoResult<Member>;

    find(): MemberRepoResult<Member[]>;

    findById(memberId: MemberId): MemberRepoResult<Member>;

    dumpAccounts(): MemberRepoResult<Account[]>;

    saveAccounts(accounts: Account[]): MemberRepoResult<SaveAccountsResult>;

    findUnlinkedAccounts(): MemberRepoResult<Account[]>;
}
