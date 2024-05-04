import { Inject } from "@nestjs/common";
import { AsyncActionResult } from "@t1fr/backend/ddd-types";
import { Account, AccountId, Member, MemberId } from "../model";

export const MemberRepo = () => Inject(MemberRepo);


export type SaveAccountsResult = { inserted: number, deleted: number, modified: number, ids: AccountId[] }

export type FindAccountByIdResult = { owner?: Member, account: Account }

export interface MemberRepo {

    save<T extends Member | Member[]>(data: T, markLeaveOnNoUpdate?: true): AsyncActionResult<MemberId[]>;

    findMemberById(memberId: MemberId): AsyncActionResult<Member>;

    findMemberByAccountId(accountId: AccountId): AsyncActionResult<Member>;

    dumpAccounts(): AsyncActionResult<Account[]>;

    saveAccounts(accounts: Account[]): AsyncActionResult<SaveAccountsResult>;

    findUnlinkedAccounts(): AsyncActionResult<Account[]>;

    findAccountById(accountId: AccountId): AsyncActionResult<FindAccountByIdResult>;

    backup(year: number, seasonIndex: number): AsyncActionResult<void>;
}
