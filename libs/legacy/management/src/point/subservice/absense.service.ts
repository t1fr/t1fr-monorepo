import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { groupBy } from "lodash";
import dayjs from "dayjs";
import { numberToRomanNumeral } from "romanumber";
import { PointSubservice } from "./service.interface";
import { AccountSnapshot } from "../account.snapshot.schema";
import { Summary } from "../summary.schema";
import { AbsenceCalculateData } from "./result.data";
import { ScheduleService } from "@t1fr/legacy/schedule";

@Injectable()
export class AbsenceService implements PointSubservice {
  async calculate(snapshotModel: Model<AccountSnapshot>, summaries: Summary[]): Promise<AbsenceCalculateData[]> {
    const data = await snapshotModel.aggregate<AbsenceCalculateData>([
      { $match: { type: "🇸 聯隊戰主帳" } },
      { $set: { point: 0, reason: [] } },
      { $unset: ["activity", "type"] },
    ]);

    const summaryIndex = summaries.reduce<{ [key: string]: Summary }>((acc, cur) => ({ ...acc, [cur._id]: cur }), {});
    const forgiveDate = dayjs().startOf("month").subtract(3, "weeks");
    let { year, season } = ScheduleService.CurrentSeason;
    if (season === 1) {
      year--;
      season = 6;
    } else {
      season--;
    }
    const seasonRomanize = numberToRomanNumeral(season);
    data.forEach(value => {
      value.currentPoint = summaryIndex[value.owner!].points.請假.sum;
      const onVacation = summaryIndex[value.owner!].onVacation;
      if (value.personalRating >= 300) {
        value.point = Math.min(2 - value.currentPoint, 0.5);
        value.reason.push(`${year}-${seasonRomanize} 達標`);
        value.group = "達標隊員";
        if (value.point > 0) value.group += "（未滿上限）";
      } else if (onVacation) {
        value.point = Math.max(0 - value.currentPoint, -1);
        value.reason.push(`${year}-${seasonRomanize} 未達標`);
        value.group = "已請假隊員";
      } else if (dayjs(value.joinDate, "YYYY-MM-DD").isBefore(forgiveDate)) {
        value.point = Math.max(0 - value.currentPoint, -1);
        value.reason.push(`${year}-${seasonRomanize} 未達標`);
        value.group = value.currentPoint < 1 ? "需轉休閒隊員" : "未達標隊員";
      } else {
        value.point = 0;
        value.group = "新進隊員";
      }
      value.previewPoint = value.currentPoint + value.point;
      value.isExist = summaryIndex[value.owner!].isExist;
    });

    return data;
  }

  toPost(data: AbsenceCalculateData[]): string[] {
    const groupByRating = groupBy(data.filter(value => value.group !== "達標隊員"), it => it.group);
    const content: string[] = [];
    for (const groupByRatingKey of Object.keys(groupByRating)) {
      content.push(`## ${groupByRatingKey}：`);
      groupByRating[groupByRatingKey].forEach(account => {
        if (account.isExist) content.push(`> <@${account.owner}>（請假點數 ${account.currentPoint} → ${account.previewPoint} 點）`);
        else content.push(`> <@${account.owner}>（已離隊）（請假點數 ${account.currentPoint} → ${account.previewPoint} 點）`);
      });
    }

    content.push("");
    content.push("**未列在上面的隊員，請假點數沒有變化**");

    return content;
  }
}
