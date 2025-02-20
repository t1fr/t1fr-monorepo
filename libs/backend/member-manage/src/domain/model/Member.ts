import { AggregateRoot, DomainError, EntityId } from "@t1fr/backend/ddd-types";
import { countBy, get } from "lodash-es";
import { Err, Ok, Result } from "ts-results-es";
import { Account, AccountId } from "./Account";
import { AccountType } from "./AccountType";
import { InvalidAccountTypeCountError } from "./DomainError";
import { MemberType } from "./MemberType";
import { PointLog, type PointSummary } from "./PointLog";
import { PointType } from "./PointType";

interface RequiredMemberProps {
    type: MemberType;
    accounts: Account[];
    isSponsor: boolean;
    isLeave: boolean;
    point: {
        summary: PointSummary,
        logs: PointLog[]
    };
}

interface NonBussinessMemberProps {
    nickname?: string;
    isOfficer?: boolean;
    onVacation?: boolean;
    avatarUrl?: string;
}


type MemberProps = Required<RequiredMemberProps> & Partial<NonBussinessMemberProps>

type MemberCreateOptions = Pick<MemberProps, "type" | "nickname" | "isOfficer" | "avatarUrl" | "isLeave">
type TypeChangePolicy = (account: Account) => Result<void, DomainError>;

export class MemberId extends EntityId<string> {
}

export class Member extends AggregateRoot<MemberId, MemberProps> {

    static create(id: MemberId, options: MemberCreateOptions) {
        const initialPointState = {
            summary: {
                [PointType.Absense]: 0,
                [PointType.Reward]: 0,
                [PointType.Penalty]: 0,
                isInitAbsense: true,
            },
            logs: [],
        };

        return Ok(new Member(id, { ...options, accounts: [], isSponsor: false, point: initialPointState }));
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

    updatePoint(log: PointLog) {
        switch (log.props.type) {
            case PointType.Reward: {
                if (this.props.point.summary.reward >= 60) return false;
                this.props.point.logs.push(log)
                break;
            }
            case PointType.Absense: {
                this.props.point.logs.push(log)
                break;
            }
            case PointType.Penalty: {
                this.props.point.logs.push(log)
                break;
            }
            default:
                throw Error(`未知的點數類型 ${log.props.type}`)
        }
        return true;
    }

    updateInfo(info: NonBussinessMemberProps) {
        if (info.isOfficer) this.props.isOfficer = info.isOfficer;
        if (info.onVacation) this.props.onVacation = info.onVacation;
        if (info.avatarUrl) this.props.avatarUrl = info.avatarUrl;
        if (info.nickname) this.props.nickname = info.nickname;
        return Ok.EMPTY;
    }

    changeType(value: MemberType) {
        if (this.props.type === value) return Ok.EMPTY;
        const policy = Member.typeChangePolicies[value];
        const staging = this.props.accounts.map(it => it.clone());
        return Result.all(...staging.map(policy))
            .andThen(() => this.validAccounts(value, staging))
            .map(() => {
                this.props.accounts = staging;
                this.props.type = value;
            });
    }

    set isSponsor(value: boolean) {
        this.props.isSponsor = value;
    }

    private validAccounts(type: MemberType, accounts: Account[]) {
        const counts = countBy(accounts, it => it.type);
        const n = get(counts, AccountType.N_RelaxMain, 0);
        const s = get(counts, AccountType.S_SqbMain, 0);
        const a = get(counts, AccountType.A_PrivateAlt, 0);
        const b = get(counts, AccountType.B_PublicAlt, 0);

        if (s >= 2) return Err(InvalidAccountTypeCountError.create(this.id, "S 聯隊戰主帳不可多於 1 個"));
        if (n >= 2) return Err(InvalidAccountTypeCountError.create(this.id, "N 休閒主帳不可多於 1 個"));
        if (n === 1 && s === 1) return Err(InvalidAccountTypeCountError.create(this.id, "S 聯隊戰主帳與 N 休閒主帳不可同時存在"));
        if ((a >= 1 || b >= 1) && s === 0) return Err(InvalidAccountTypeCountError.create(this.id, "需先有 1 個 S 聯隊戰主帳才可追加 A 個人小帳與 B 公用小帳"));
        if (type === MemberType.Relaxer && s >= 1) return Err(InvalidAccountTypeCountError.create(this.id, "休閒隊員不可擁有 S 聯隊戰主帳"));
        if (type === MemberType.SquadFighter && n >= 1) return Err(InvalidAccountTypeCountError.create(this.id, "聯隊戰隊員不可擁有 N 休閒主帳"));
        return Ok.EMPTY;
    }

    changeAccountType(accountId: AccountId, type: AccountType) {
        const staging = this.props.accounts.map(it => it.clone());
        const target = staging.find(it => it.id.equals(accountId));
        if (!target) return Ok.EMPTY;
        return target.setType(type).andThen(() => this.setAccounts(staging));
    }

    findAccount(accountId: AccountId) {
        return this.accounts.find(account => account.id.equals(accountId));
    }

    assignAccount(account: Account): Result<void, DomainError> {
        const staging = [...this.accounts, account];
        return this.setAccounts(staging);
    }

    removeAccount(accountId: AccountId) {
        const staging = this.accounts.filter(it => !it.id.equals(accountId));
        return this.setAccounts(staging);
    }

    get type() {
        return this.props.type;
    }

    private setAccounts(value: Account[]) {
        return this.validAccounts(this.type, value)
            .andThen(() => {
                this.props.accounts = value;
                return Ok.EMPTY;
            });
    }

    get accounts() {
        return this.props.accounts;
    }

    get isLeave() {
        return this.props.isLeave;
    }

    get nickname(): string | undefined {
        return this.props.nickname;
    }

    set nickname(value: string) {
        this.props.nickname = value;
    }

    get isOfficer(): boolean | undefined {
        return this.props.isOfficer;
    }

    set isOfficer(value: boolean) {
        this.props.isOfficer = value;
    }

    get onVacation(): boolean | undefined {
        return this.props.onVacation;
    }

    set onVacation(value: boolean) {
        this.props.onVacation = value;
    }

    get avatarUrl(): string | undefined {
        return this.props.avatarUrl;
    }

    set avatarUrl(newUrl: string) {
        this.props.avatarUrl = newUrl;
    }

    get pointLogs() {
        return this.props.point.logs;
    }

    disband() {
        this.props.isLeave = true;
    }
}


