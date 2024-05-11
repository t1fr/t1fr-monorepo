import type { Undefinedable } from "@t1fr/backend/ddd-types";
import { countBy, get, pickBy } from "lodash-es";
import { Types } from "mongoose";
import { Account, AccountId, Member, MemberId, PointLog, PointType } from "../../domain";
import { AccountSchema, MemberSchema, PointLogSchema } from "../mongoose";

export type MemberDoc = Undefinedable<Omit<MemberSchema, "accounts">, "avatarUrl" | "onVacation" | "isOfficer" | "nickname">;
export type AccountDoc = Undefinedable<AccountSchema, "personalRating" | "name" | "activity" | "joinDate" | "owner">;
export type PointDoc = Pick<PointLogSchema, "comment" | "category" | "delta" | "type" | "memberId">;

export class PointLogMapper {
    static toMongo(memberId: MemberId, log: PointLog): PointDoc {
        const { category, comment, delta, type } = log.props;
        return { memberId: memberId.value, category, comment: comment ?? "", delta: new Types.Decimal128(delta.toString()), type }
    }
}


export class AccountMapper {
    static fromMongo(doc: AccountSchema): Account {
        const id = new AccountId(doc.gaijinId);
        return Account.rebuild(id, doc);
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
    static fromMongo(doc: Pick<MemberSchema, "type" | "accounts" | "pointLogs" | "discordId" | "isSponsor" | "isLeave">): Member {
        const id = new MemberId(doc.discordId);
        const accounts = doc.accounts.map(account => AccountMapper.fromMongo(account));
        const pointCount = countBy(doc.pointLogs, it => it.type);
        const hasInitAbsense = doc.pointLogs.some(it => it.category === "入隊發放");
        return Member.rebuild(id, {
            type: doc.type,
            accounts: accounts,
            isSponsor: doc.isSponsor,
            isLeave: doc.isLeave,
            point: {
                summary: {
                    [PointType.Penalty]: get(pointCount, PointType.Penalty, 0),
                    [PointType.Reward]: get(pointCount, PointType.Reward, 0),
                    [PointType.Absense]: get(pointCount, PointType.Absense, 0),
                    isInitAbsense: hasInitAbsense,
                },
                logs: [],
            },
        });
    }

    static toMongo(member: Member): { doc: MemberDoc, accounts: AccountDoc[], logs: PointDoc[] } {
        const accounts = member.accounts.map(account => AccountMapper.toMongo(member.id, account));
        const logs = member.pointLogs.map(it => (PointLogMapper.toMongo(member.id, it)))
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
        return { doc, accounts, logs };
    }
}