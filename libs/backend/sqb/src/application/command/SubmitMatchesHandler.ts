import { CommandHandler, type IInferredCommandHandler } from "@nestjs/cqrs";
import type { DomainError } from "@t1fr/backend/ddd-types";
import dayjs from "dayjs";
import { Ok, type Result } from "ts-results-es";
import { SquadronMatch, SquadronMatchId, SquadronMatchRepo } from "../../domain";
import { SubmitMatches, type SubmitMatchesOutput } from "./SubmitMatches";

@CommandHandler(SubmitMatches)
export class SubmitMatchesHandler implements IInferredCommandHandler<SubmitMatches> {

    @SquadronMatchRepo()
    private readonly squadronMatchRepo!: SquadronMatchRepo;

    async execute(command: SubmitMatches): Promise<Result<SubmitMatchesOutput, DomainError>> {
        const parseOrError = command.parse()

        if (parseOrError.isErr()) return parseOrError;

        const { matches: matchData, battleRating } = parseOrError.value;

        const createMatchOrError = matchData
            .map(it =>
                SquadronMatch.create(
                    new SquadronMatchId(),
                    {
                        battleRating,
                        ourName: it.ourName,
                        timeSeries: it.timeSeries,
                        enemyName: it.enemyName,
                        ourTeam: it.ourTeam,
                        enemyTeam: it.enemyTeam,
                        isVictory: it.isVictory,
                        timestamp: it.timestamp
                    }
                )
            )

        const response = new Array<SubmitMatchesOutput[number]>()

        for (let i = 0; i < createMatchOrError.length; i++) {
            const result = createMatchOrError[i]
            if (result.isOk()) {
                await this.hasSimilar(result.value)
                    .then(match => this.squadronMatchRepo.upsert(match))
                    .then(() => {
                        response.push({ index: i, success: true })
                    })
                    .catch(reason => {
                        response.push({ index: i, success: false, reason })
                    })
            } else {
                response.push({ index: i, success: false, reason: result.error.toString() })
            }
        }

        return Ok(response);
    }

    private async hasSimilar(match: SquadronMatch): Promise<SquadronMatch> {
        const { timestamp, battleRating } = match.toObject()
        const timestampDayJs = dayjs(timestamp);
        const from = timestampDayJs.subtract(5, "minutes").toDate()
        const to = timestampDayJs.add(5, "minutes").toDate()

        const findPossibleOrError = await this.squadronMatchRepo.findWithinTimespan(battleRating, from, to).promise;

        if (findPossibleOrError.isErr()) throw Error(findPossibleOrError.error.toString())

        const possibleMatches = findPossibleOrError.value;
        if (possibleMatches.length === 0) return match;

        // 降序
        const similarities = possibleMatches
            .map(it => ({ similarity: it.calcuateSimilarity(match), match: it }))
            .toSorted((a, b) => b.similarity - a.similarity)

        const mostSimilar = similarities[0];
        return mostSimilar.similarity >= 80 ? mostSimilar.match.merge(match) : match
    }
}