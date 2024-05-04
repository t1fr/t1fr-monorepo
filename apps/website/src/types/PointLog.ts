import type { PointType } from "@t1fr/backend/member-manage";
import dayjs from "dayjs";

type PointLogProp = {
    date: string;
    delta: string;
    category: string;
    memberId: string;
    comment: string;
}

export class PointLog {
    memberId: string;
    dateLabel: string;
    dateUnix: number;
    delta: string;
    category: string;
    comment: string;

    constructor(props: PointLogProp) {
        this.category = props.category;
        this.comment = props.comment;
        this.memberId = props.memberId;
        this.delta = props.delta;
        const dayJsDate = dayjs(props.date)
        this.dateLabel = dayJsDate.format("YYYY 年 MM 月 DD 日")
        this.dateUnix = dayJsDate.unix()
    }

}

export const PointTypeNameMap: Record<PointType, string> = {
    "absense": "請假",
    "reward": "獎勵",
    "penalty": "懲處",
}