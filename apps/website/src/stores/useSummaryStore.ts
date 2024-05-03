import type { Summary } from "../types";

export const useSummaryStore = defineStore("個人資訊與統計", () => {
    const summary = ref<Summary>();
    const httpService = useHttpService();

    function fetch() {
        httpService
            .get<Summary>("/members/me/summary", { withCredentials: true })
            .then((value) => (summary.value = value))
    }

    return { summary, fetch };
});
