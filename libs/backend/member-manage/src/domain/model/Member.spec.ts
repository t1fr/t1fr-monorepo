import { isEqual } from "lodash";
import { randomInteger, randomString } from "zufall";
import { Account, AccountId } from "./Account";
import { AccountType } from "./AccountType";
import { Member, MemberId } from "./Member";
import { MemberType } from "./MemberType";

type MemberObjectLiteral = Omit<Member["props"], "accounts"> & { accounts: Account["props"][] }

function createMember(props: MemberObjectLiteral) {
    const { accounts, ...other } = props;
    const accountEntities = accounts.map(it => Account.rebuild(new AccountId(randomInteger(100000, 150000)), it));
    return Member.rebuild(new MemberId(randomString(12)), { ...other, accounts: accountEntities });
}

function isMemberEqual(member: Member, props: MemberObjectLiteral) {
    const { accounts, ...others } = member["props"];
    return isEqual({ ...others, accounts: accounts.map(it => it["props"]) }, props);
}

describe("設置隊員類型", () => {
    it("當休閒隊員 => 聯隊戰隊員時，應當將所擁有的休閒主帳變為聯隊戰主帳，並自動發給 1 點請假點數", () => {
        const member = createMember({ type: MemberType.Relaxer, accounts: [{ type: AccountType.N_RelaxMain }], isSponsor: false });
        const result = member.changeType(MemberType.SquadFighter);
        expect(result.isOk()).toBeTruthy();
        expect(isMemberEqual(member, {
            type: MemberType.SquadFighter,
            accounts: [
                { type: AccountType.S_SqbMain },
            ],
            isSponsor: false,
        })).toBeTruthy();
        // expect(member.pointlogs).toStrictEqual([{ type: PointType.Absent, delta: 1, category: AbsentPointCategory.Initial }] satisfies PointLog["props"][]);
    });

    it("當聯隊戰隊員 => 聯隊戰隊員時，做一次 NOOP", () => {
        const member = createMember({ type: MemberType.SquadFighter, accounts: [{ type: AccountType.S_SqbMain }], isSponsor: false });

        const result = member.changeType(MemberType.SquadFighter);

        expect(result.isOk()).toBeTruthy();
        expect(isMemberEqual(member, {
            type: MemberType.SquadFighter,
            accounts: [
                { type: AccountType.S_SqbMain },
            ],
            isSponsor: false,
        })).toBeTruthy();
    });

    it("當聯隊戰隊員 => 休閒隊員時，若只有一個遊戲帳號，應當將該聯隊戰主帳變為休閒主帳，並沖銷獎勵點數", () => {
        const member = createMember({ type: MemberType.SquadFighter, accounts: [{ type: AccountType.S_SqbMain }], isSponsor: false });

        const result = member.changeType(MemberType.Relaxer);

        expect(result.isOk()).toBeTruthy();
        expect(isMemberEqual(member, {
            type: MemberType.Relaxer,
            accounts: [
                { type: AccountType.N_RelaxMain },
            ],
            isSponsor: false,
        })).toBeTruthy();
    });

    it("當聯隊戰隊員 => 休閒隊員時，若有複數個遊戲帳號，則應該回傳錯誤，並且不得變更任何屬性", () => {
        const member = createMember({
            type: MemberType.SquadFighter,
            accounts: [{ type: AccountType.S_SqbMain }, { type: AccountType.A_PrivateAlt }],
            isSponsor: false,
        });

        const result = member.changeType(MemberType.Relaxer);

        expect(result.isOk()).toBeFalsy();
        expect(isMemberEqual(member, {
            type: MemberType.SquadFighter,
            accounts: [
                { type: AccountType.S_SqbMain },
                { type: AccountType.A_PrivateAlt },
            ],
            isSponsor: false,
        })).toBeTruthy();
    });
});

describe("帳號類型數量檢驗", () => {
    const functionUnderTest = Member["validAccounts"];
    it.each([[MemberType.Relaxer], [MemberType.SquadFighter]])(`沒有帳號應返回 OK：%s`, (type) => {
        const result = functionUnderTest(type, []);
        expect(result.isOk()).toBeTruthy();
    });
});