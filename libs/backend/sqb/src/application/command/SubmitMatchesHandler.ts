import { CommandHandler, type IInferredCommandHandler } from "@nestjs/cqrs";
import type { ActionResult, DomainError } from "@t1fr/backend/ddd-types";
import dayjs from "dayjs";
import { Ok, type Result } from "ts-results-es";
import { SquadronMatch, SquadronMatchId, SquadronMatchRepo } from "../../domain";
import { SubmitMatches } from "./SubmitMatches";

@CommandHandler(SubmitMatches)
export class SubmitMatchesHandler implements IInferredCommandHandler<SubmitMatches> {

    @SquadronMatchRepo()
    private readonly squadronMatchRepo!: SquadronMatchRepo;

    async execute(command: SubmitMatches): Promise<Result<void, DomainError>> {
        const parseOrError = command.parse()

        if (parseOrError.isErr()) return parseOrError;

        const { matches: matchData, battleRating } = parseOrError.value;

        const matches = matchData
            .map(it =>
                SquadronMatch.create(
                    new SquadronMatchId(it.timeSeries),
                    {
                        battleRating,
                        enemyName: it.enemyName,
                        ourTeam: it.ourTeam,
                        enemyTeam: it.enemyTeam,
                        isVictory: it.isVictory,
                        timestamp: it.timestamp
                    }
                )
            )
            .filter((it): it is Ok<SquadronMatch> => it.isOk())
            .map(it => it.value)

        const matchesNeedSave = new Array<SquadronMatch>()

        for (const match of matches) {
            const result = await this.hasSimilar(match)
            if (result.isOk() && !result.value) matchesNeedSave.push(match)
        }


        await this.squadronMatchRepo.save(matchesNeedSave).promise;

        return Ok.EMPTY;
    }

    private async hasSimilar(match: SquadronMatch): Promise<ActionResult<boolean>> {
        const { timestamp, battleRating } = match.toObject()
        const timestampDayJs = dayjs(timestamp);
        const from = timestampDayJs.subtract(5, "minutes").toDate()
        const to = timestampDayJs.add(5, "minutes").toDate()

        const findPossibleOrError = await this.squadronMatchRepo.findWithinTimespan(battleRating, from, to).promise;

        if (findPossibleOrError.isErr()) return findPossibleOrError;

        const possibleMatches = findPossibleOrError.value;
        if (possibleMatches.length === 0) return Ok(false);

        // 降序
        const similarities = possibleMatches
            .map(it => it.calcuateSimilarity(match))
            .toSorted((a, b) => b - a)

        return Ok(similarities[similarities.length - 1] >= 80)
    }
}