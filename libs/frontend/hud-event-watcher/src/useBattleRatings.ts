import { useQuery } from "@tanstack/vue-query";
import { BackendClient } from "./api";

export function useBattleRatings() {
    const { data: battleRatings, isSuccess } = useQuery({
        queryKey: ["battle-ratings"],
        queryFn: () => BackendClient.get<string[]>("sqb/battle-ratings")
    })

    return { battleRatings, isSuccess }
}