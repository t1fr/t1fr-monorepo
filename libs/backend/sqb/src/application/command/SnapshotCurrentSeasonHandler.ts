import { CommandHandler, IInferredCommandHandler } from "@nestjs/cqrs";
import { range } from "lodash-es";
import { History, HistoryId, HistoryRepo, Section, Squad } from "../../domain";
import { SnapshotCurrentSeason } from "./SnapshotCurrentSeason";

@CommandHandler(SnapshotCurrentSeason)
export class SnapshotCurrentSeasonHandler implements IInferredCommandHandler<SnapshotCurrentSeason> {
    @HistoryRepo()
    private readonly repo!: HistoryRepo;

    async execute() {
        const now = new Date();
        const { year, seasonIndex } = Section.getMetaFromTime(now);
        const id = new HistoryId({ year, seasonIndex });
        const top100 = new Array<Squad>();
        const squadChunksResult = await Promise.all(range(1, 6).map(i => this.repo.fetch(i).promise));
        squadChunksResult.forEach(result => {
            if (result.isOk()) top100.push(...result.value);
        });

        const history = History.create(id, { top100 });

        if (history.me === null) {
            for (const i of range(6, 15)) {
                const result = await this.repo
                    .fetch(i)
                    .andThen(squads => History.searchMe(squads))
                    .map(t1fr => {
                        history.me = t1fr;
                    }).promise;
                if (result.isOk()) break;
            }
        }

        return this.repo.save(history).map(id => id.value).promise;
    }
}
