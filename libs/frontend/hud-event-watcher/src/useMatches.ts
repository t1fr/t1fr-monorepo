import type { SubmitMatchesOutput } from "@t1fr/backend/sqb";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { uniq } from "lodash-es";
import { ref, toRaw, watch, type Ref } from "vue";
import { BackendClient, WarthunderLocalhostClient } from "./api";
import { Match, type HudMessage } from "./types";

async function fetchHudMessage(damageId: number) {
    return WarthunderLocalhostClient.get<HudMessage>("hudmsg", { params: { lastEvt: 0, lastDmg: damageId } })
}

async function uploadMatches(battleRating: string, matches: Match[]) {
    const completedMatches = matches.filter(it => it.isUploadable)
        .map(it => ({
            timestamp: it.timestamp,
            enemyName: it.enemyName,
            timeSeries: uniq(it.timeSeries),
            ourTeam: Array.from(it.ourTeam.entries()).map(([id, vehicle]) => ({ id, vehicle })),
            enemyTeam: Array.from(it.enemyTeam.entries()).map(([id, vehicle]) => ({ id, vehicle })),
            isVictory: it.isVictory
        }))

    return BackendClient.post<SubmitMatchesOutput>("sqb/matches", { battleRating, matches: completedMatches })
}

type SubmitMatchesData = {
    battleRating: string,
    deleteUploaded: boolean
}

export function useMatches(enabled: Ref<boolean>) {
    const id = ref(0);
    const parsedMatches = ref<Match[]>([])
    const { data, isSuccess } = useQuery({
        queryKey: ["hud-message"],
        queryFn: () => fetchHudMessage(id.value),
        refetchInterval: 5000,
        enabled
    })


    watch([isSuccess, data], () => {
        if (!isSuccess.value || !data.value) return;
        id.value = data.value.damage.at(-1)?.id ?? id.value
        const matches = Match.parse(toRaw(data.value))

        if (matches.length === 0) return;
        if (parsedMatches.value.length === 0) {
            parsedMatches.value.push(...matches)
        } else {
            const lastMatch = toRaw(parsedMatches.value[parsedMatches.value.length - 1])
            const fetchedFirstMatch = matches[0]
            if (lastMatch.lastId + 1 === fetchedFirstMatch.firstId) {
                parsedMatches.value.length = parsedMatches.value.length - 1
                parsedMatches.value.push(lastMatch.merge(fetchedFirstMatch))
                if (matches.length > 1) parsedMatches.value.push(...matches.slice(1))
            } else {
                parsedMatches.value.push(...matches)
            }
        }
    })

    function reset() {
        id.value = 0;
        parsedMatches.value = [];
    }

    const { mutateAsync, isPending: isUploading } = useMutation({
        mutationFn: (battleRating: string) => uploadMatches(battleRating, parsedMatches.value),
        onSuccess(data) {
            const map = new Map(data.map(({ index, ...other }) => [index, other]))
            let i = 0;
            for (const match of parsedMatches.value) {
                if (!match.isUploadable) continue;
                match.uploadStatus = map.get(i);
                i++;
            }
        }
    })

    async function upload(data: SubmitMatchesData) {
        const result = await mutateAsync(data.battleRating)
        if (data.deleteUploaded) parsedMatches.value = parsedMatches.value.filter(it => it.uploadStatus?.success !== true)
        return result.filter(it => it.success).length;
    }


    return { matches: parsedMatches, reset, upload, isUploading }
}
