import type { MemberDetail } from "@t1fr/backend/member-manage";
import { useQuery } from "@tanstack/vue-query";

export function useMySummary() {
    const { data: summary, refetch, isFetching } = useQuery({
        queryKey: ["my-summary"],
        queryFn: () => BackendClient.get<MemberDetail>("/members/me/summary"),
        select: data => mapSummary(data),
    })

    return { summary, refetch, isFetching };
}