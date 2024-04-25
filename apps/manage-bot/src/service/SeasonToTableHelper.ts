import { FindCurrentSeasonOutput } from "@t1fr/backend/sqb-schedule";
import dayjs from "dayjs";

export class SeasonToTableHelper {
    static convert({ year, seasonIndex, sections }: FindCurrentSeasonOutput, notification: boolean) {
        const startMonth = (seasonIndex - 1) * 2 + 1;
        const scheduleMessage = [
            `**${year} 年 ${startMonth} ~ ${startMonth + 1} 月**聯隊戰行程`,
            "```",
            "╭───────┬───────┬──────────╮",
            "│ Start │  End  │  Max BR  │",
            "├───────┼───────┼──────────┤",
        ];

        if (notification) scheduleMessage.unshift("<@&1145364425658867754>");

        const sectionRows = sections.map(section => {
            const startString = dayjs(section.from).format("MM/DD");
            const endString = dayjs(section.to).subtract(1, "day").format("MM/DD");
            const battleRatingString = section.battleRating.toFixed(1).padStart(6);
            return `│ ${startString} │ ${endString} │  ${battleRatingString}  │`;
        });

        sectionRows.forEach(sectionRow => {
            scheduleMessage.push(sectionRow, "├───────┼───────┼──────────┤");
        });

        scheduleMessage[scheduleMessage.length - 1] = "╰───────┴───────┴──────────╯";
        scheduleMessage.push("```");

        return scheduleMessage.join("\n");
    }
}