import type { MemberDetail } from "@t1fr/backend/member-manage";
import type { Serialized } from "@t1fr/frontend/http-client";
import { mapValues } from "lodash-es";
import { Account, PointLog, type Summary } from "../types";

export function mapSummary(value: Serialized<MemberDetail>): Summary {
    const { accounts, point } = value
    return {
        accounts: accounts.map(it => new Account({ id: it.id, name: it.name, personalRating: it.personalRating, activity: it.activity, type: it.type, joinDate: it.joinDate, ownerId: null })),
        point: mapValues(point, it => ({ total: it.total, logs: it.logs.map(log => new PointLog(log)) })),
    }
}