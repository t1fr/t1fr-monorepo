import { AccountType, PointType } from "../../domain";

export interface PointLog {
    date: Date,
    delta: string;
    comment: string;
    category: string;
    memberId: string;
}

interface Account {
    id: string;

    name: string;

    personalRating: number;

    activity: number;

    type: AccountType | null;

    joinDate: Date;
}

export interface MemberDetail {
    accounts: Account[];
    point: Record<PointType, { total: number, logs: PointLog[] }>;
}