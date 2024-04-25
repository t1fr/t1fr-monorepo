import { CommandHandler, IInferredCommandHandler } from "@nestjs/cqrs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Err, Result } from "ts-results-es";
import { InvalidSectionFormatError, Season, SeasonRepo, Section } from "../../domain";
import { NewSeasonFromText } from "./NewSeasonFromText";

type SectionParseData = { year: number, fromText: string, toText: string, brText: string }

dayjs.extend(utc);

@CommandHandler(NewSeasonFromText)
export class NewSeasonFromTextHandler implements IInferredCommandHandler<NewSeasonFromText> {

    @SeasonRepo()
    private readonly seasonRepo!: SeasonRepo;

    private readonly matcher = /(\d*\.\d*)\s*\((\d*\.\d*).*?(\d*\.\d*)\)/;
    private readonly seperator = "\n";

    private static parseFromText({ year, fromText, toText, brText }: SectionParseData) {
        return Section.create({
            from: dayjs.utc(`${year}.${fromText}`, "YYYY.DD.MM").toDate(),
            to: dayjs.utc(`${year}.${toText}`, "YYYY.DD.MM").add(1, "day").toDate(),
            battleRating: parseFloat(brText),
        });
    }

    async execute(command: NewSeasonFromText) {
        const parseOrError = command.parse();
        if (parseOrError.isErr()) return parseOrError;
        const { text, year } = parseOrError.value;
        return Result.all(
            ...text
                .split(this.seperator)
                .map(line => {
                    const matches = line.match(this.matcher);
                    if (!matches) return Err(InvalidSectionFormatError.create(line));
                    const [brText, fromText, toText] = matches.slice(1);
                    return NewSeasonFromTextHandler.parseFromText({ year, fromText, toText, brText });
                }),
        )
            .andThen(sections => Season.create(year, sections))
            .toAsyncResult()
            .andThen(season => this.seasonRepo.save(season))
            .map(seasonId => seasonId.value)
            .promise;
    }
}
