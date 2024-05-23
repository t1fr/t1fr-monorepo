import type { SearchMatchRecordsOutput } from "@t1fr/backend/sqb";
import { useQuery } from "@tanstack/vue-query";
import { useNow } from "@vueuse/core";
import dayjs from "dayjs";
import "dayjs/plugin/relativeTime";
import { computed, type Ref } from "vue";
import { BackendClient } from "./api";


type SearchMatchRecordsParams = { br?: string, enemyName?: string, ourName: string }

export function useMatchRecords(params: Ref<SearchMatchRecordsParams>) {
    const enabled = computed(() => Boolean(params.value.br && params.value.enemyName?.trim() && params.value.ourName.trim()))
    const { data: records, isFetching, refetch, dataUpdatedAt, isPending } = useQuery({
        queryKey: ["matches-record", params],
        queryFn: () => BackendClient.get<SearchMatchRecordsOutput>("sqb/matches", { params: params.value }),
        // 5 分鐘
        staleTime: 300000,
        enabled
    })

    const now = useNow()
    const formatedUpdatedTimeAgo = computed(() => dayjs(now.value).to(dataUpdatedAt.value))


    return { records, isFetching, refetch, formatedUpdatedTimeAgo, isPending }
}