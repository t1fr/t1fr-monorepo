import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Err, Result } from "ts-results-es";
import { InvalidSectionFormatError, Section } from "./model";

dayjs.extend(utc);


type SectionParseData = { year: number, fromText: string, toText: string, brText: string }

export class TextToSectionHelper {
    private static readonly matcher = /(\d*\.\d*)\s*\((\d*\.\d*).*?(\d*\.\d*)\)/;
    private static readonly seperator = "\n";

    private static parseFromText(year: number, line: string) {
        const matches = line.match(this.matcher);
        if (!matches) return Err(InvalidSectionFormatError.create(line));
        const [brText, fromText, toText] = matches.slice(1);
        return Section.create({
            from: dayjs.utc(`${year}.${fromText}`, "YYYY.DD.MM").toDate(),
            to: dayjs.utc(`${year}.${toText}`, "YYYY.DD.MM").add(1, "day").toDate(),
            battleRating: parseFloat(brText),
        });
    }

    static convert(year: number, text: string) {
        const lines = text.split(this.seperator);
        const sectionOrErrors = lines.map(line => this.parseFromText(year, line));
        return Result.all(...sectionOrErrors);
    }
}