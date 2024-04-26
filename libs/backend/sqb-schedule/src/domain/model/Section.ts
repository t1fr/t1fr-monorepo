import { ValueObject } from "@t1fr/backend/ddd-types";
import { Err, Ok } from "ts-results-es";
import "dayjs/plugin/utc";
import { InvalidSectionError } from "./DomainError";

interface SectionProps {
    from: Date;
    to: Date;
    battleRating: number;
}

export type SeasonMeta = { year: number, seasonIndex: number }

export class Section extends ValueObject<SectionProps> {
    static create({ from, to, battleRating }: SectionProps) {
        if (from > to) return Err(InvalidSectionError.create(`from: ${from.toDateString()} 不可晚於 to: ${to.toDateString()}`));
        if (battleRating < 1.0) return Err(InvalidSectionError.create(`分房 ${battleRating} 不可小於 1.0`));
        return Ok(new Section({ from, to, battleRating }));
    }

    static rebuild(props: SectionProps) {
        return new Section(props);
    }

    get from() {
        return this.props.from;
    }

    get to() {
        return this.props.to;
    }

    get battleRating() {
        return this.props.battleRating;
    }

    get meta() {
        return Section.getMetaFromTime(this.from);
    }

    static getMetaFromTime(time: Date): SeasonMeta {
        return {
            year: time.getFullYear(),
            seasonIndex: Math.floor(time.getMonth() / 2) + 1,
        };
    }
}

