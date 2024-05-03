import type { PointType } from "@t1fr/backend/member-manage";
import dayjs from "dayjs";
import type { Account } from "./Account";

type PointLogProp = {
    date: string;
    delta: string;
    category: string;
    comment: string;
}

export class PointLog {
    dateLabel: string;
    dateUnix: number;
    delta: string;
    category: string;
    comment: string;

    constructor(props: PointLogProp) {
        this.category = props.category;
        this.comment = props.comment;
        this.delta = props.delta;
        const dayJsDate = dayjs(props.date)
        this.dateLabel = dayJsDate.format("YYYY 年 MM 月 DD 日")
        this.dateUnix = dayJsDate.unix()
    }

}


export interface Summary {
    accounts: Pick<Account, "name" | "activity" | "personalRating" | "type">[];
    points: { [key in PointType]: { sum: number; logs: PointLog[] } };
}