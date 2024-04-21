import { DomainError } from "@t1fr/backend/ddd-types";
import { AccountType } from "./AccountType";

export class InvalidAccountTypeCountError extends DomainError {
    protected override context: string = InvalidAccountTypeCountError.name;
    static create(reason: string): InvalidAccountTypeCountError {
        return new InvalidAccountTypeCountError({ message: reason });
    }
}

export class ViolateAccountTypeRuleError extends DomainError {
    protected override context: string = ViolateAccountTypeRuleError.name;
    static create(toType: AccountType) {
        return new ViolateAccountTypeRuleError({ message: `非 ${AccountType.S_SqbMain} 不可變更為 ${toType}` });
    }
}


