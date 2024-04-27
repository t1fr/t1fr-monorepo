import { Season } from "@t1fr/backend/sqb";
import dayjs from "dayjs";

export class SeasonToTableHelper {
    static convert({ year, seasonIndex, sections }: Season, notificationRole: string | null) {
        const startMonth = (seasonIndex - 1) * 2 + 1;
        const scheduleMessage = [
            `**${year} 年 ${startMonth} ~ ${startMonth + 1} 月**聯隊戰行程`,
            "```",
            "╭───────┬───────┬──────────╮",
            "│ Start │  End  │  Max BR  │",
            "├───────┼───────┼──────────┤",
        ];

        if (notificationRole) scheduleMessage.unshift(`<@&${notificationRole}>`);

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
