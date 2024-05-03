import type { AccountType } from "@t1fr/backend/member-manage";
import dayjs from "dayjs";

const typeMap: Record<AccountType, string> = {
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
    ownerId: string | null;
    readonly personalRating: number;
    readonly activity: number;

    type: AccountType | null;

    private cachedTypeLabel?: string | null;
    private cachedType?: AccountType | null;

    readonly joinDateLabel: string;
    readonly joinDateUnix: number;

    constructor(props: AccountRebuildProps) {
        const { name, personalRating, activity, type, joinDate, id, ownerId } = props;
        this.id = id;
        this.name = name;
        this.type = type;
        this.personalRating = personalRating;
        this.activity = activity;
        const dayjsJoinDate = dayjs(joinDate);
        this.joinDateLabel = dayjsJoinDate.format("YYYY 年 MM 月 DD 日");
        this.joinDateUnix = dayjsJoinDate.unix();
        this.ownerId = ownerId;
    }


    get typeLabel() {
        if (this.cachedType !== this.type) {
            this.cachedTypeLabel = this.type ? typeMap[this.type] : null
            this.cachedType = this.type;
            return this.cachedTypeLabel;
        } else {
            if (this.cachedTypeLabel === undefined) this.cachedTypeLabel = this.type ? typeMap[this.type] : null
            return this.cachedTypeLabel;
        }
    }
}

