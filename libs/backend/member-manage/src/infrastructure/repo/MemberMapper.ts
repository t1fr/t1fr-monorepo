import { Undefinedable } from "@t1fr/backend/ddd-types";
import { pickBy } from "lodash";
import { Account, AccountId, Member, MemberId } from "../../domain";
import { AccountSchema, MemberSchema } from "../mongoose";

export type MemberDoc = Undefinedable<Omit<MemberSchema, "accounts">, "avatarUrl" | "onVacation" | "isOfficer" | "nickname">;
export type AccountDoc = Undefinedable<AccountSchema, "personalRating" | "name" | "activity" | "joinDate" | "owner">;

export class AccountMapper {
    static fromMongo(doc: AccountSchema): Account {
        const id = new AccountId(doc.gaijinId);
        const { type } = doc;
        return Account.rebuild(id, { type });
    }

    static toMongo(memberId: MemberId, account: Account): AccountDoc {
        return pickBy({
            gaijinId: account.id.value,
            type: account.type,
            ownerId: memberId.value,
            name: account.name,
            activity: account.activity,
            personalRating: account.personalRating,
            joinDate: account.joinDate,
        }, it => it !== undefined) as unknown as AccountDoc;
    }
}

export class MemberMapper {
    static fromMongo(doc: MemberSchema): Member {
        const id = new MemberId(doc.discordId);
        const accounts = doc.accounts.map(account => AccountMapper.fromMongo(account));
        return Member.rebuild(id, { type: doc.type, accounts: accounts, isSponsor: doc.isSponsor, isLeave: doc.isLeave });
    }

    static toMongo(member: Member): { doc: MemberDoc, accounts: AccountDoc[] } {
        const accounts = member.accounts.map(account => AccountMapper.toMongo(member.id, account));
        const doc = pickBy({
            discordId: member.id.value,
            type: member.type,
            isSponsor: member.isSponsor,
            isLeave: member.isLeave,
            nickname: member.nickname,
            avatarUrl: member.avatarUrl,
            onVacation: member.onVacation,
            isOfficer: member.isOfficer,
        }, it => it !== undefined) as unknown as MemberDoc;
        return { doc, accounts };
    }
}