import { AggregateRoot, DomainError, EntityId } from "@t1fr/backend/ddd-types";
import { countBy, get } from "lodash";
import { Err, Ok, Result } from "ts-results-es";
import { Account, AccountId } from "./Account";
import { AccountType } from "./AccountType";
import { InvalidAccountTypeCountError } from "./DomainError";
import { MemberType } from "./MemberType";


interface MemberProps {
    type: MemberType;
    accounts: Account[];
    isSponsor: boolean;
    nickname?: string;
    isOfficer?: boolean;
    isLeave?: boolean;
    avatarUrl?: string;
}

type MemberCreateOptions = Pick<MemberProps, "type" | "nickname" | "isOfficer" | "avatarUrl">
type TypeChangePolicy = (account: Account) => Result<void, DomainError>;

export class MemberId extends EntityId<string> {
}

export class Member extends AggregateRoot<MemberId, MemberProps> {
    static create(id: MemberId, options: MemberCreateOptions) {
        return Ok(new Member(id, { ...options, isLeave: false, accounts: [], isSponsor: false }));
    }

    static rebuild(id: MemberId, options: MemberProps) {
        return new Member(id, options);
    }

    private static typeChangePolicies: Record<MemberType, TypeChangePolicy> = {
        relaxer(account: Account) {
            if (account.type === AccountType.S_SqbMain) return account.setType(AccountType.N_RelaxMain);
            return Ok.EMPTY;
        },
        squad_fighter(account: Account) {
            if (account.type === AccountType.N_RelaxMain) return account.setType(AccountType.S_SqbMain);
            return Ok.EMPTY;
        },
    };

    changeType(value: MemberType) {
        if (this.props.type === value) return Ok.EMPTY;
        const policy = Member.typeChangePolicies[value];
        const staging = this.props.accounts.map(it => it.clone());
        return Result.all(...staging.map(policy))
            .andThen(() => Member.validAccounts(value, staging))
            .map(() => {
                this.props.accounts = staging;
                this.props.type = value;
            });
    }


    set isSponsor(value: boolean) {
        this.props.isSponsor = value;
    }

    private static validAccounts(type: MemberType, accounts: Account[]) {
        const counts = countBy(accounts, it => it.type);
        const n = get(counts, AccountType.N_RelaxMain, 0);
        const s = get(counts, AccountType.S_SqbMain, 0);
        const a = get(counts, AccountType.A_PrivateAlt, 0);
        const b = get(counts, AccountType.B_PublicAlt, 0);

        if (s >= 2) return Err(InvalidAccountTypeCountError.create("S 聯隊戰主帳不可多於 1 個"));
        if (n >= 2) return Err(InvalidAccountTypeCountError.create("N 休閒主帳不可多於 1 個"));
        if (n === 1 && s === 1) return Err(InvalidAccountTypeCountError.create("S 聯隊戰主帳與 N 休閒主帳不可同時存在"));
        if ((a >= 1 || b >= 1) && s === 0) return Err(InvalidAccountTypeCountError.create("需先有 1 個 S 聯隊戰主帳才可追加 A 個人小帳與 B 公用小帳"));
        if (type === MemberType.Relaxer && s >= 1) return Err(InvalidAccountTypeCountError.create("休閒隊員不可擁有 S 聯隊戰主帳"));
        if (type === MemberType.SquadFighter && n >= 1) return Err(InvalidAccountTypeCountError.create("聯隊戰隊員不可擁有 N 休閒主帳"));
        return Ok.EMPTY;
    }

    changeAccountType(accountId: AccountId, type: AccountType) {
        const staging = this.props.accounts.map(it => it.clone());
        const target = staging.find(it => it.id.equals(accountId));
        if (!target) return Ok.EMPTY;
        return target.setType(type)
            .andThen(() => Member.validAccounts(this.props.type, staging))
            .map(() => {
                this.props.accounts = staging;
            });
    }

    get type() {
        return this.props.type;
    }

    get accounts() {
        return this.props.accounts;
    }
}


