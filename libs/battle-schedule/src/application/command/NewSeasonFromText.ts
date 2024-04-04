import { Command } from "@lib/ddd-types";

type ParseScheduleData = { year: number, text: string }

export class NewSeasonFromText extends Command<ParseScheduleData> {
}

