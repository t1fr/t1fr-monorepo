import { CommandHandler, IInferredCommandHandler } from "@nestjs/cqrs";
import { range } from "lodash";
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
        range(1, 11)
            .map(i => this.repo.fetch(i))
            .forEach(result =>
                result.map(squads => {
                    top100.push(...squads);
                }),
            );

        const history = History.create(id, { top100 });

        if (history.finalPos === null) {
            for (const i of range(11, 21)) {
                const result = await this.repo
                    .fetch(i)
                    .andThen(squads => History.searchPos(squads))
                    .map(pos => {
                        history.finalPos = pos;
                    }).promise;
                if (result.isOk()) break;
            }
        }

        return this.repo.save(history).map(id => id.value).promise;
    }
}
