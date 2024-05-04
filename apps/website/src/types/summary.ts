import type { PointType } from "@t1fr/backend/member-manage";
import type { Account } from "./Account";
import type { PointLog } from "./PointLog";

export interface Summary {
    accounts: Pick<Account, "name" | "activity" | "personalRating" | "type">[];
    points: { [key in PointType]: { sum: number; logs: PointLog[] } };
}