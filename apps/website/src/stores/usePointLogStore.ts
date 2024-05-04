import type { GetPointLogDTO, PointType } from "@t1fr/backend/member-manage";
import { PointLog } from "../types";

type PointTypeLogsMap = Map<PointType, PointLog[]>;
type PointTypeTotalMap = Map<PointType, number>;

export const usePointLogStore = defineStore("點數事件", () => {
    const httpService = useHttpService();
    const loading = ref(false);
    const logs = ref<PointTypeLogsMap>(new Map());
    const total = ref<PointTypeTotalMap>(new Map());

    async function load(type: PointType, skip: number, rows: number, memberId: string | null) {
        const data = { skip, rows, memberId: memberId ?? undefined };
        const url = `point-logs/${type}`;
        const result = await httpService.post<GetPointLogDTO>(url, data, { withCredentials: true });
        total.value.set(type, result.total);
        logs.value.set(type, result.logs.map(it => new PointLog(it)));
    }

    return { load, loading, total, logs };
});
