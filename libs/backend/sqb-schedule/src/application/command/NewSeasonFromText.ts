import { Command } from "@t1fr/backend/ddd-types";

type ParseScheduleData = { year: number, text: string }

export class NewSeasonFromText extends Command<ParseScheduleData> {
}

