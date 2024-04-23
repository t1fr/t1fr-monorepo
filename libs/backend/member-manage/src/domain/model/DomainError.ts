import { DomainError } from "@t1fr/backend/ddd-types";
import { AccountId } from "./Account";
import { AccountType } from "./AccountType";
import { MemberId } from "./Member";

export class InvalidAccountTypeCountError extends DomainError {
    constructor(readonly memberId: MemberId, reason: string) {
        super({ context: InvalidAccountTypeCountError, message: reason });
    }

    static create(memberId: MemberId, reason: string): InvalidAccountTypeCountError {
        return new InvalidAccountTypeCountError(memberId, reason);
    }
}

export class ViolateAccountTypeRuleError extends DomainError {

    static create(toType: AccountType) {
        return new ViolateAccountTypeRuleError({ context: ViolateAccountTypeRuleError, message: `非 ${AccountType.S_SqbMain} 不可變更為 ${toType}` });
    }
}

export class MemberNotFoundError extends DomainError {
    readonly memberId: string;

    constructor(memberId: MemberId) {
        super({ context: ViolateAccountTypeRuleError, message: `找不到 ID 為 ${memberId.value} 的成員`, noLog: true });
        this.memberId = memberId.value;
    }

    static create(memberId: MemberId) {
        return new MemberNotFoundError(memberId);
    }
}


export class AccountNotFoundError extends DomainError {
    static create(accountId: AccountId) {
        return new AccountNotFoundError({ context: AccountNotFoundError, message: `找不到 ID 為 ${accountId.value} 的戰雷帳號` });
    }
}

