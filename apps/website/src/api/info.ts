import type { MemberInfo } from "@t1fr/backend/member-manage";
import { useQuery } from "@tanstack/vue-query";

export function useInfo() {
    const { data: info } = useQuery({
        queryKey: ["info"],
        queryFn: () => BackendClient.get<MemberInfo>("me/info"),
        retry: false,
        refetchOnWindowFocus: false
    })

    return { info };
}