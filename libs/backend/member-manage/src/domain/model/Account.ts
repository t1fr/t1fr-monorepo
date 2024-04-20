import { Entity, EntityId } from "@t1fr/backend/ddd-types";
import { Err, Ok } from "ts-results-es";
import { AccountType } from "./AccountType";
import { ViolateAccountTypeRuleError } from "./DomainError";

export interface AccountProps {
    type: AccountType | null;
    name?: string;
    personalRating?: number;
    activity?: number;
    joinDate?: Date;
}

export class AccountId extends EntityId<number> {
}

type CreateAccountOptions = Omit<AccountProps, "type">

export class Account extends Entity<AccountId, AccountProps> {
    static create(id: AccountId, props: CreateAccountOptions) {
        return Ok(new Account(id, { ...props, type: null }));
    }

    static rebuild(id: AccountId, props: AccountProps) {
        return new Account(id, props);
    }

    clone() {
        return new Account(this.id, { ...this.props });
    }

    get type() {
        return this.props.type;
    }

    setType(value: AccountType | null) {
        if ((value === AccountType.C_PublicMain || value === AccountType.D_SemipublicMain) && this.props.type !== AccountType.S_SqbMain) return Err(ViolateAccountTypeRuleError.create(value));
        this.props.type = value;
        return Ok.EMPTY;
    }
}