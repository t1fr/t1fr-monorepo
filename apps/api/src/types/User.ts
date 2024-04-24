import { MemberInfo } from "@t1fr/backend/member-manage";

export type UserPayload = MemberInfo

export class User {
    constructor(readonly data: UserPayload) {
    }
}