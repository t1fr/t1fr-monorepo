import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Err, Result } from "ts-results-es";
import { Season, SeasonRepo, Section } from "../../domain";
import { NewSeasonFromText } from "./NewSeasonFromText";

@CommandHandler(NewSeasonFromText)
export class NewSeasonFromTextHandler implements ICommandHandler<NewSeasonFromText> {

    @SeasonRepo()
    private readonly seasonRepo!: SeasonRepo;

    private readonly matcher = /(\d*\.\d*)\s*\((\d*\.\d*).*?(\d*\.\d*)\)/;
    private readonly seperator = "\n";

    async execute(command: NewSeasonFromText) {
        const parseOrError = command.parse();
        if (parseOrError.isErr()) return parseOrError;
        const { text, year } = parseOrError.value;
        const sectionParseResult = Result.all(
            ...text
                .split(this.seperator)
                .map(line => {
                    const matches = line.match(this.matcher);
                    if (!matches) return Err(`${line} 不合剖析格式`);
                    const [brText, fromText, toText] = matches.slice(1);
                    return Section.parse({ year, fromText, toText, brText });
                }),
        );

        if (sectionParseResult.isErr()) return sectionParseResult;

        const sections = sectionParseResult.value;
        const createSeasonResult = Season.create(year, sections);

        if (createSeasonResult.isErr()) return createSeasonResult;

        return this.seasonRepo.save(createSeasonResult.value);
    }
}
