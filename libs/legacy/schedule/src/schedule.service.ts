import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ChannelType, Client } from "discord.js";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import dayjs from "dayjs";
import * as process from "process";
import { HttpService } from "@nestjs/axios";
import Range from "lodash/range";
import { Season, Section } from "./season.schema";
import { LeaderboardData } from "./leaderboard.data";
import { GithubService } from "@t1fr/backend/backup";
import "dayjs/plugin/utc";
import { ConnectionName } from "./constant";

@Injectable()
export class ScheduleService {
    private static readonly logger = new Logger(ScheduleService.name);

    constructor(
        @InjectModel(Season.name, ConnectionName.Management) private readonly seasonModel: Model<Season>,
        private readonly client: Client,
        private readonly httpService: HttpService,
        private readonly githubService: GithubService,
        // private readonly accountService: AccountService,
    ) {
    }

    async upsertSeason(year: string, raw: string) {
        const sections = ScheduleService.parseTextToSections(parseInt(year), raw);
        sections.sort((a, b) => dayjs(a.from).diff(b.from));
        await this.seasonModel.findOneAndUpdate(
            { year: sections[0].from.getFullYear(), season: sections[0].from.getMonth() / 2 + 1 },
            { sections: sections },
            { upsert: true },
        );
    }

    async getLatestSeason() {
        return this.seasonModel.findOne({}, { season: true, year: true, sections: true }, { sort: { _id: -1 } }).exec();
    }

    async getCurrentBattleRating() {
        const { now, year, season } = ScheduleService.CurrentSeason;
        const sections = await this.seasonModel.aggregate<{ battleRating: number }>([
            { $match: { year, season } },
            { $unwind: "$sections" },
            { $match: { "sections.from": { $lte: now }, "sections.to": { $gt: now } } },
            { $project: { _id: 0, battleRating: "$sections.battleRating" } },
        ]);

        return sections.length ? sections[0].battleRating : null;
    }

    static get CurrentSeason() {
        const now = new Date();
        const year = now.getUTCFullYear();
        const season = Math.floor(now.getUTCMonth() / 2) + 1;
        return { now, year, season };
    }

    async getCurrentSeasonTable() {
        const { year, season } = ScheduleService.CurrentSeason;
        const found = await this.seasonModel.findOne({ year, season });

        if (!found) return Promise.reject("查無當前賽季資料");

        return ScheduleService.seasonToTable(found);
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { utcOffset: 0 })
    async updateBulletin() {
        if (process.env["NODE_ENV"] === "test") return;
        const battleRating = await this.getCurrentBattleRating();
        const messages = { category: "聯隊戰", announcement: "今日分房：新賽季" };
        if (battleRating) {
            const brString = battleRating.toFixed(1).replace(/\d/g, digitToFullwidth);
            messages.announcement = `今日分房：${brString}`;
            messages.category = `聯隊戰：${brString}`;
        }
        const category = this.client.channels.resolve("1046624503276515339");
        if (category && category.type === ChannelType.GuildCategory) {
            category.setName(messages.category);
        }

        const channel = this.client.channels.resolve("1047751571708051486");
        if (channel && channel.type === ChannelType.GuildVoice) {
            channel.setName(messages.announcement);
        }

        ScheduleService.logger.log("更新聯隊戰分房");

        return battleRating !== undefined;
    }

    private static seasonToTable(currentSeason: Season) {
        const { year, season, sections } = currentSeason;
        const startMonth = (season - 1) * 2 + 1;
        const scheduleMessage = [
            `**${year} 年 ${startMonth} ~ ${startMonth + 1} 月**聯隊戰行程`,
            "```",
            "╭───────┬───────┬──────────╮",
            "│ Start │  End  │  Max BR  │",
            "├───────┼───────┼──────────┤",
        ];

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

    isLastDayOfMonth(now: Date) {
        const lastDayOfMonth = dayjs.utc().endOf("month");
        return lastDayOfMonth.isSame(now, "day");
    }

    @Cron(CronExpression.EVERY_DAY_AT_11PM, { utcOffset: 0 })
    async snapshot(force = false) {
        // const { now, year, season } = ScheduleService.CurrentSeason;
        // if (!force && !this.isLastDayOfMonth(now)) return;
        // const accounts = await this.accountService.listAccounts();
        //
        // const top100squads = await this.scrapLeaderboard(1, 5);
        // let position = null;
        // let t1fr = top100squads.find(squad => squad._id === 1078072);
        // if (t1fr) {
        //     position = t1fr.pos;
        // } else {
        //     const top100to200squads = await this.scrapLeaderboard(6, 5);
        //     t1fr = top100to200squads.find(squad => squad._id === 1078072);
        //     if (t1fr) position = t1fr.pos;
        // }
        //
        // await this.seasonModel.updateOne({ year, season }, { $set: { accounts, finalPos: position, top100squads: top100squads.map(processLeaderboardData) } });
    }

    async scrapLeaderboard(startPage: number, total: number) {
        const queryUrl = (page: number) => `https://warthunder.com/en/community/getclansleaderboard/dif/_hist/page/${page}/sort/dr_era5`;

        const response = await Promise.all(
            Range(startPage, startPage + total).map(page => {
                return new Promise<LeaderboardData[]>(resolve => {
                    this.httpService.axiosRef.get<{ data: LeaderboardData[] }>(queryUrl(page)).then(data => resolve(data.data.data));
                });
            }),
        );

        return response.reduce((acc, cur) => [...acc, ...cur], []);
    }

    static parseTextToSections(year: number, scheduleText: string): Section[] {
        return scheduleText
            .split("\n")
            .map(line => line.match(/(\d*\.\d*)\s*\((\d*\.\d*).*?(\d*\.\d*)\)/))
            .map(matches => {
                if (!matches) throw new Error("提供的賽季論壇訊息不合格式");
                return {
                    from: dayjs.utc(`${year}.${matches[2]}`, "YYYY.DD.MM").toDate(),
                    to: dayjs.utc(`${year}.${matches[3]}`, "YYYY.DD.MM").add(1, "day").toDate(),
                    battleRating: parseFloat(matches[1]),
                };
            });
    }

    @Cron("50 07 30 * *", { utcOffset: 0 })
    async backup() {
        const seasons = await this.seasonModel.find().sort({ year: -1, season: -1 }).limit(3);
        const content = JSON.stringify(seasons.map(season => season.toObject()));
        await this.githubService.upsertFile("season.json", content);
    }
}

const digitFullwidthMap: Record<string, string> = { "0": "０", "1": "１", "2": "２", "3": "３", "4": "４", "5": "５", "6": "６", "7": "７", "8": "８", "9": "９" };

function digitToFullwidth(digit: string) {
    return digitFullwidthMap[digit];
}
