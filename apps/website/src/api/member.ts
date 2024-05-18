import type { ListExistMemberDTO, MemberDetail } from "@t1fr/backend/member-manage";
import { useQuery } from "@tanstack/vue-query";
import { keyBy, mapValues } from "lodash-es";
import type { Ref } from "vue";
import { Member } from "../types";

async function fetchMembers() {
    const dtos = await BackendClient.get<ListExistMemberDTO[]>("members")
    return dtos.map(member => {
        const { id, name, noAccount, isOfficer, avatarUrl, onVacation, type, isSponsor, } = member;
        return new Member({ id, name, isOfficer, noAccount, avatarUrl, onVacation, type, isSponsor })
    })
}

export function useMembers() {
    const { data: members, refetch, isFetching, isPending } = useQuery({
        queryKey: ["members"],
        queryFn: () => fetchMembers()
    })

    const index = computed(() => mapValues(keyBy(members.value ?? [], it => it.id), it => it))

    return { members, refetch, isFetching, index, isPending }
}

export function useMember(memberId: Ref<string | null>) {
    const { index, isPending } = useMembers()
    const { data: member } = useQuery({
        queryKey: ["members", { memberId }],
        queryFn: () => memberId.value ? (index.value[memberId.value] ?? null) : null,
        enabled: () => !isPending.value
    })

    return { member }
}

export function useMemberSummary(memberId: Ref<string | null>) {
    const { data: summary } = useQuery({
        queryKey: ["member-detail", { memberId }],
        queryFn: () => memberId.value ? BackendClient.get<MemberDetail>(`/members/${memberId}/summary`) : null,
        enabled: () => memberId.value !== null,
        select: data => data ? mapSummary(data) : null,
        staleTime: 60000
    })

    return { summary };
}