import { DomainError } from "@t1fr/backend/ddd-types";
import { AccountType } from "./AccountType";
import { MemberId } from "./Member";

export class InvalidAccountTypeCountError extends DomainError {
    static create(reason: string): InvalidAccountTypeCountError {
        return new InvalidAccountTypeCountError({ context: InvalidAccountTypeCountError, message: reason });
    }
}

export class ViolateAccountTypeRuleError extends DomainError {

    static create(toType: AccountType) {
        return new ViolateAccountTypeRuleError({ context: ViolateAccountTypeRuleError, message: `非 ${AccountType.S_SqbMain} 不可變更為 ${toType}` });
    }
}

export class MemberNotFoundError extends DomainError {
    static create(memberId: MemberId) {
        return new MemberNotFoundError({ context: ViolateAccountTypeRuleError, message: `找不到 ID 為 ${memberId.value} 的成員`, noLog: true });
    }
}


