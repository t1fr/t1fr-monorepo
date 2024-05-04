import type { GetPointLogDTO, PointType } from "@t1fr/backend/member-manage";
import { debounce, Subject, timer } from "rxjs";
import { PointLog } from "../types";

type PointTypeLogsMap = Map<PointType, PointLog[]>;
type PointTypeTotalMap = Map<PointType, number>;

export const usePointLogStore = defineStore("點數事件", () => {
    const httpService = useHttpService();
    const loading = ref(false);
    const logs = ref<PointTypeLogsMap>(new Map());
    const total = ref<PointTypeTotalMap>(new Map());

    const source = new Subject<{ type: PointType, skip: number, rows: number, memberId: string | null }>()

    function load(type: PointType, skip: number, rows: number, memberId: string | null) {
        source.next({ type, skip, rows, memberId })
    }

    source.pipe(debounce(() => timer(400))).subscribe(({ type, skip, rows, memberId }) => {
        const timeout = setTimeout(() => { loading.value = true; }, 1000)
        const data = { skip, rows, memberId: memberId ?? undefined };
        const url = `point-logs/${type}`;
        httpService.post<GetPointLogDTO>(url, data, { withCredentials: true })
            .then(result => {
                total.value.set(type, result.total);
                logs.value.set(type, result.logs.map(it => new PointLog(it)));
                clearTimeout(timeout)
            })
            .finally(() => loading.value = false)
    })


    return { load, loading, total, logs };
});
