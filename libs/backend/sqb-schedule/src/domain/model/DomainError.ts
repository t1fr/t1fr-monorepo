import { DomainError } from "@t1fr/backend/ddd-types";
import { SeasonId } from "./Season";
import { Section } from "./Section";

export class SectionSpanError extends DomainError {
    static create(seasonIndex: number, sections: Section[]) {
        const sectionTexts = sections.map(section => `${section.from.toDateString()} ~ ${section.to.toDateString()}: ${section.battleRating}`);
        return new SectionSpanError({
            context: SectionSpanError,
            message: [`各分房應該都在 ${seasonIndex} 期間，但有部分發生跨越賽季情況:`, ...sectionTexts].join("\n"),
        });
    }
}

export class InvalidSectionError extends DomainError {
    static create(error: string) {
        return new InvalidSectionError({ context: SectionSpanError, message: `分房排程屬性有誤: ${error}` });
    }
}

export class InvalidSectionFormatError extends DomainError {
    static create(paragraph: string) {
        return new InvalidSectionFormatError({ context: InvalidSectionFormatError, message: `分房排程格式有誤: ${paragraph}，無法剖析` });
    }
}


export class SeasonNotFoundError extends DomainError {
    static create(seasonId: SeasonId) {
        return new SeasonNotFoundError({
            context: SeasonNotFoundError,
            message: `無法找到 ${seasonId.value.year} 年第 ${seasonId.value.seasonIndex} 的賽季資訊`,
        });
    }
}