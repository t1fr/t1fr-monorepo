import type { AccountType, AssignAccountOwnerOutput, ListAccountDTO, ListExistMemberDTO, SetAccountTypeOutput } from "@t1fr/backend/member-manage";
import { keyBy, mapValues } from "lodash-es";
import { Err, Ok } from "ts-results-es";
import { Account, Member, type Summary } from "../types";

export type MemberMap = { [key: string]: { avatar: string; nickname: string | null } };

export const useMemberStore = defineStore("成員與帳號", () => {
    const members = ref<Member[]>([]);
    const memberOptions = computed(() => members.value.map((member) => ({ value: member.id, callsign: member.callsign, id: member.gameId, avatarUrl: member.avatarUrl })),);
    const memberMap = computed(() => mapValues(keyBy(members.value, it => it.id), it => ({ avatar: it.avatarUrl, nickname: it.callsign })));
    const summaries = ref<Record<string, Summary>>({});

    const accounts = ref<Account[]>([]);
    const http = useHttpService();

    load();


    async function load() {
        http
            .get<ListExistMemberDTO[]>("members", { withCredentials: true })
            .then((data) => (members.value = data.map(member => {
                const { id, name, noAccount, isOfficer, avatarUrl } = member;
                return new Member(id, name, isOfficer, noAccount, avatarUrl)
            })))
        http
            .get<ListAccountDTO[]>("accounts", { withCredentials: true })
            .then((data) => (accounts.value = data.map(account => {
                const { id, name, personalRating, joinDate, activity, type, ownerId } = account;
                return new Account({ id, name, ownerId, personalRating, activity, type, joinDate })
            })))
    }

    function loadSummary(memberId: string) {
        if (summaries.value[memberId]) return;
        http
            .get<Summary>(`/members/${memberId}/summary`, { withCredentials: true })
            .then((value) => (summaries.value[memberId] = value))
    }

    function findAccountById(id: string) {
        return accounts.value.find(it => it.id === id);
    }

    async function updateAccountType(id: string, value: AccountType) {
        const target = findAccountById(id)
        if (target === undefined) return Err("無效的操作")
        const { type } = await http.patch<SetAccountTypeOutput>(`accounts/${id}`, { type: value }, { withCredentials: true })
        target.type = type;

        return Ok({ name: target.name, type: target.type })
    }

    async function updateAccountOwner(id: string, ownerId: string) {
        const target = findAccountById(id)
        if (target === undefined) return Err("無效的操作")
        const { newOwnerId, oldOwnerId } = await http.patch<AssignAccountOwnerOutput>(`accounts/${target.id}`, { ownerId }, { withCredentials: true })
        target.ownerId = newOwnerId;
        return Ok({ name: target.name, newOwnerId, oldOwnerId })
    }

    return { members, accounts, summaries, memberOptions, memberMap, updateAccount: { ownerId: updateAccountOwner, type: updateAccountType }, loadSummary };
});
