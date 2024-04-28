import { PointType } from "../../domain";

interface PointLog {
    date: Date,
    delta: number;
    comment: string;
    category: string;
}

interface Account {
    id: string;

    name: string;

    personalRating: number;

    activity: number;

    type: string | null;

    joinDate: Date;
}

export interface MemberDetail {
    accounts: Account[];
    point: Record<PointType, { total: number, logs: PointLog[] }>;
}