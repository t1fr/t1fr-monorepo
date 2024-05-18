import type { AccountType } from "@t1fr/backend/member-manage";
import dayjs from "dayjs";

export const AccountTypeMap: Record<AccountType, string> = {
    "sqb_main": "S 聯隊戰主帳",
    "relax_main": "N 休閒主帳",
    "private_alt": "A 個人小帳",
    "public_main": "C 公用主帳",
    "public_alt": "B 公用小帳",
    "semipublic_main": "D 半公用主帳",
};



type AccountRebuildProps = {
    id: string,
    name: string,
    ownerId: string | null,
    personalRating: number,
    activity: number,
    type: AccountType | null,
    joinDate: string,
}

export class Account {

    readonly id: string;
    readonly name: string;
    readonly ownerId: string | null;
    readonly hasOwner: boolean;
    readonly personalRating: number;
    readonly activity: number;

    readonly type: AccountType | null;

    readonly typeLabel: string | null;
    readonly joinDate: string;
    readonly joinDateLabel: string;
    readonly joinDateUnix: number;

    constructor(props: AccountRebuildProps) {
        const { name, personalRating, activity, type, joinDate, id, ownerId } = props;
        this.id = id;
        this.name = name;
        this.type = type;
        this.typeLabel = this.type ? AccountTypeMap[this.type] : null

        this.personalRating = personalRating;
        this.activity = activity;
        const dayjsJoinDate = dayjs(joinDate);
        this.joinDate = joinDate;
        this.joinDateLabel = dayjsJoinDate.format("YYYY 年 MM 月 DD 日");
        this.joinDateUnix = dayjsJoinDate.unix();

        this.ownerId = ownerId;
        this.hasOwner = ownerId !== null;
    }

    setType(value: AccountType) {
        return new Account({ ...this, type: value })
    }

    setOwner(value: string) {
        return new Account({ ...this, ownerId: value })
    }

}

