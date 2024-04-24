import { Inject } from "@nestjs/common";
import { DomainError } from "@t1fr/backend/ddd-types";
import { AsyncResult } from "ts-results-es";
import { Account, AccountId, Member, MemberId, NonRequiredAccountProps } from "../model";

export const MemberRepo = () => Inject(MemberRepo);

export type MemberRepoResult<T> = AsyncResult<T, DomainError>

export type SaveAccountsResult = { inserted: number, deleted: number, modified: number }

export  type FindAccountByIdResult = { owner?: Member, account: Account }

export interface MemberRepo {

    save<T extends Member | Member[]>(data: T): MemberRepoResult<void>;

    findMemberHaveAccount(accountId: AccountId): MemberRepoResult<Member>;

    find(): MemberRepoResult<Member[]>;

    findMemberById(memberId: MemberId): MemberRepoResult<Member>;

    dumpAccounts(): MemberRepoResult<Account[]>;

    saveAccounts(accounts: Account[]): MemberRepoResult<SaveAccountsResult>;

    findUnlinkedAccounts(): MemberRepoResult<Account[]>;

    findAccountById(accountId: AccountId, selection?: (keyof NonRequiredAccountProps)[]): MemberRepoResult<FindAccountByIdResult>;
}
