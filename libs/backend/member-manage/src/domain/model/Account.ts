import { Entity, EntityId } from "@t1fr/backend/ddd-types";
import { Err, Ok } from "ts-results-es";
import { v4 as uuidV4 } from "uuid";
import { AccountType } from "./AccountType";
import { ViolateAccountTypeRuleError } from "./DomainError";

export interface RequiredAccountProps {
    type: AccountType | null;
    personalRating: number;
}

export interface NonRequiredAccountProps {
    name: string;
    activity: number;
    joinDate: Date;
}

export type AccountProps = Required<RequiredAccountProps> & Partial<NonRequiredAccountProps>

export class AccountId extends EntityId<string> {
    constructor(value: string | undefined) {
        super(value ?? uuidV4())
    }
}

export type CreateAccountOptions = Omit<AccountProps, "type">

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

    get name() {
        return this.props.name;
    }

    get personalRating() {
        return this.props.personalRating;
    }

    get joinDate() {
        return this.props.joinDate;
    }

    get activity() {
        return this.props.activity;
    }
}