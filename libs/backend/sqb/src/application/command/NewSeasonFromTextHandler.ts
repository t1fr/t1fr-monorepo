import { CommandHandler, type IInferredCommandHandler } from "@nestjs/cqrs";
import { uniqWith } from "lodash-es";
import { Err } from "ts-results-es";
import { SectionRepo, SectionSpanError } from "../../domain";
import { TextToSectionHelper } from "../../domain/TextToSectionHelper";
import { NewSeasonFromText } from "./NewSeasonFromText";

@CommandHandler(NewSeasonFromText)
export class NewSeasonFromTextHandler implements IInferredCommandHandler<NewSeasonFromText> {
    @SectionRepo()
    private readonly seasonRepo!: SectionRepo;

    async execute(command: NewSeasonFromText) {
        const parseOrError = command.parse();
        if (parseOrError.isErr()) return parseOrError;
        const { text, year } = parseOrError.value;
        return TextToSectionHelper.convert(year, text)
            .toAsyncResult()
            .andThen(sections => {
                const metas = uniqWith(
                    sections.map(it => it.meta),
                    (value, other) => value.year === other.year && value.seasonIndex === other.seasonIndex,
                );
                if (metas.length !== 1) return Err(SectionSpanError.create(metas[0].seasonIndex, sections));
                return this.seasonRepo.save(sections);
            }).promise;
    }
}
