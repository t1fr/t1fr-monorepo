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

    constructor(memberId: MemberId | string) {
        const memberIdValue = memberId instanceof MemberId ? memberId.value : memberId;
        super({ context: ViolateAccountTypeRuleError, message: `找不到 ID 為 ${memberIdValue} 的成員`, noLog: true });
        this.memberId = memberIdValue;
    }

    static create(memberId: MemberId | string) {
        return new MemberNotFoundError(memberId);
    }
}


export class AccountNotFoundError extends DomainError {
    static create(accountId: AccountId) {
        return new AccountNotFoundError({ context: AccountNotFoundError, message: `找不到 ID 為 ${accountId.value} 的戰雷帳號` });
    }
}

export class AccountNoOwnerError extends DomainError {
    static create(accountId: AccountId) {
        return new AccountNoOwnerError({ context: AccountNoOwnerError, message: `戰雷帳號 ${accountId.value} 還未有主人，不可設置帳號類型` });
    }
}

export class MemberNoAccountError extends DomainError {
    memberIds: string[] = [];
    static create(memberIds: MemberId[]) {
        const error = new MemberNoAccountError({ context: MemberNoAccountError, message: `有 ${memberIds.length} 位成員沒有帳號` })
        error.memberIds = memberIds.map(it => it.value);
        return error;
    }
}

