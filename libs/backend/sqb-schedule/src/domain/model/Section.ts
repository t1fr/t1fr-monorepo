import { ValueObject } from "@t1fr/backend/ddd-types";
import { Err, Ok } from "ts-results-es";
import dayjs from "dayjs";
import "dayjs/plugin/utc";

interface SectionProps {
	from: Date;
	to: Date;
	battleRating: number;
}

type SectionParseData = { year: number, fromText: string, toText: string, brText: string }

export class Section extends ValueObject<SectionProps> {
	static create({ from, to, battleRating }: SectionProps) {
		if (from > to) return Err(`from: ${from} 不可晚於 to: ${to}`);
		if (battleRating < 1.0) return Err(`BR ${battleRating} 不可小於 1.0`);
		return Ok(new Section({ from, to, battleRating }));
	}

	static parse({ year, fromText, toText, brText }: SectionParseData) {
		return Section.create({
			from: dayjs.utc(`${year}.${fromText}`, "YYYY.DD.MM").toDate(),
			to: dayjs.utc(`${year}.${toText}`, "YYYY.DD.MM").add(1, "day").toDate(),
			battleRating: parseFloat(brText),
		});
	}

	setFrom(from: Date) {
		return Section.create({ ...this.props, from });
	}

	setTo(to: Date) {
		return Section.create({ ...this.props, to });
	}

	setBattleRating(battleRating: number) {
		return Section.create({ ...this.props, battleRating });
	}
}

