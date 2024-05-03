import type { PointType } from "@t1fr/backend/member-manage";
import { sumBy } from "lodash-es";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import type { DataTableOperatorFilterMetaData, DataTableSortEvent } from "primevue/datatable";

export class PointLog {
    date!: string;

    member!: string;

    category!: string;

    delta!: number;

    comment?: string;
}

type PointTypeLogsMap = Map<PointType, PointLog[]>;
type PointTypeTotalMap = Map<PointType, number>;

type PointTableFilterMeta = Record<string, DataTableOperatorFilterMetaData>

export const usePointLogStore = defineStore("點數事件", () => {
    const httpService = useHttpService();
    const loading = ref(false);
    const pointType = ref<PointType>("reward");
    const logs = ref<PointTypeLogsMap>(new Map());
    const total = ref<PointTypeTotalMap>(new Map());
    const filters = ref<PointTableFilterMeta>({
        member: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },
    });
    const delta = computed(() => (filters.value.member.constraints[0].value ? sumBy(currentLogs.value, (it) => it.delta) : null));

    const param = computed(() => ({ first: 0, rows: 20, filters: filters.value }));
    const currentTotal = computed(() => total.value.get(pointType.value) ?? 0);
    const currentLogs = computed(() => logs.value.get(pointType.value) ?? []);
    watch(pointType, () => load());

    async function load(event?: DataTableSortEvent) {
        const { first, rows } = event ?? param.value;
        const data = { first, rows, member: filters.value.member.constraints[0].value };
        const url = `point-logs?type=${pointType.value}`;
        const result = await httpService.post<{ total: number; logs: PointLog[] }>(url, data, { withCredentials: true });
        total.value.set(pointType.value, result.total);
        logs.value.set(pointType.value, result.logs);
    }

    return { pointType, load, loading, logs: currentLogs, total: currentTotal, filters, delta };
});
