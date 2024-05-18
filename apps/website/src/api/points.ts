import type { GetPointLogDTO, PointType } from "@t1fr/backend/member-manage";
import { useQuery } from "@tanstack/vue-query";
import type { Ref } from "vue";

export interface PointLogQueryParam {
    type: PointType;
    skip: number;
    rows: number;
    memberId: string | null;
}


export function usePointLogs(params: Ref<PointLogQueryParam>) {
    const debouncedParam = refDebounced(params)
    const { data, isFetching, refetch } = useQuery({
        queryKey: ["point-logs", debouncedParam],
        queryFn: () => BackendClient.post<GetPointLogDTO>(
            `point-logs/${debouncedParam.value.type}`,
            { skip: debouncedParam.value.skip, rows: debouncedParam.value.rows, memberId: debouncedParam.value.memberId ?? undefined }
        ).then(data => ({ total: data.total, logs: data.logs.map(it => new PointLog(it)) }))
    })
    return { data, isFetching, refetch }
}