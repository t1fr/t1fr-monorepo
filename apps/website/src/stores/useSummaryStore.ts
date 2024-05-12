import type { MemberDetail } from "@t1fr/backend/member-manage";
import type { Summary } from "../types";

export const useSummaryStore = defineStore("個人資訊與統計", () => {
    const summary = ref<Summary>();
    const httpService = useHttpService();

    fetch()

    function fetch() {
        httpService
            .get<MemberDetail>("/members/me/summary", { withCredentials: true })
            .then((value) => {
                summary.value = mapSummary(value)
            })
    }

    return { summary, fetch };
});
