import { Injectable, Logger } from "@nestjs/common";
import { PromisePool } from "@supercharge/promise-pool";
import { Configuration } from "@t1fr/backend/configs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { omit } from "lodash-es";
import { InjectBrowser } from "nestjs-puppeteer";
import { Browser, Page } from "puppeteer";
import { z } from "zod";

dayjs.extend(customParseFormat);

const AccountListData = z.object({
    name: z.string().transform(name => name?.match(/(?<name>[^\n@]+)(@psn|@live)?/)?.groups?.["name"]).pipe(z.string()),
    link: z.string(),
    personalRating: z.coerce.number().min(0),
    activity: z.coerce.number().min(0),
    joinDate: z.preprocess(it => dayjs(String(it), "DD.MM.YYYY").toDate(), z.date()),
}).array();

@Injectable()
export class AccountDataScraper {

    @InjectBrowser()
    private readonly browser!: Browser;

    private readonly logger = new Logger(AccountDataScraper.name);

    private static readonly squadronGaijinPage = "https://warthunder.com/en/community/claninfo/The%20First%20Frontline%20Rangers";


    private static getUidFromHtmlId(htmlId: string) {
        return htmlId?.match(/player-(?<uid>\d+)/)?.groups?.["uid"] ?? undefined;
    }

    @Configuration("gaijin")
    private readonly credential!: { username: string, password: string };


    private async login(page: Page) {
        await page.goto("https://login.gaijin.net/en/sso/login")
            .then(() => page.waitForXPath("//*[@id=\"__container\"]/div[2]/div[1]/form/div[3]/button", { timeout: 3000 }))
            .then(() => page.$x("//*[@id=\"email\"]"))
            .then(([element]) => element.focus())
            .then(() => page.keyboard.type(this.credential.username))
            .then(() => page.$x("//*[@id=\"password\"]"))
            .then(([element]) => element.focus())
            .then(() => page.keyboard.type(this.credential.password))
            .then(() => page.click("xpath=//*[@id=\"__container\"]/div[2]/div[1]/form/div[3]/button"))
            .then(() => page.waitForNavigation());
    }

    private async fetchSquadronAccountList(page: Page) {
        await page.goto(AccountDataScraper.squadronGaijinPage);
        await page.waitForSelector(".squadrons-members__table");
        return page.$$eval(
            ".squadrons-members__grid-item",
            gridItems => {
                function chunk<T>(arr: T[], chunksize: number): T[][] {
                    const tmp = [...arr];
                    const cache = [];
                    while (tmp.length) cache.push(tmp.splice(0, chunksize));
                    return cache;
                }
                return chunk(gridItems.slice(6), 6)
                    .map(([, link, personalRating, activity, , joinDate]) => ({
                        name: link.textContent?.trim(),
                        link: link.querySelector("a")?.getAttribute("href") ?? undefined,
                        personalRating: personalRating.innerHTML.trim(),
                        activity: activity.innerHTML.trim(),
                        joinDate: joinDate.innerHTML.trim(),
                    }))
            },
        ).then(data => AccountListData.parse(data));
    }

    private async fetchUidFromReplay(name: string, link: string) {
        const url = `https://warthunder.com/en/tournament/replay/type/replays?Filter%5Bkeyword%5D=&Filter%5Bnick%5D=${encodeURI(name)}&Filter%5Bstatistic_group%5D=&action=search`;
        const firstReplayItemXpath = "//*[@id=\"bodyRoot\"]/div[4]/div[2]/div[3]/div/section/div[2]/div[3]/div/a[1]";
        const playerItemSelector = `a[href="/${encodeURI(link)}"]`;
        const page = await this.browser.newPage();
        try {
            await page.goto(url);
            await page.waitForXPath(firstReplayItemXpath, { timeout: 2000 });
            await page.$eval(`xpath=${firstReplayItemXpath}`, (element) => (element as HTMLElement).click());
            await page.waitForSelector(playerItemSelector);
            const playerId = await page.$eval(playerItemSelector, a => a.id);
            const id = AccountDataScraper.getUidFromHtmlId(playerId);
            this.logger.verbose(`${name} 的 UID 為 ${id}`);
            return id;
        } catch (e) {
            this.logger.warn(`${name} 沒有重播`);
        } finally {
            await page.close();
        }
    }

    async fetch() {
        this.logger.verbose("開始爬蟲");
        const pages = await this.browser.pages();
        const page = pages.length === 0 ? (await this.browser.newPage()) : pages[0];
        await this.login(page);
        this.logger.verbose("登入成功");
        const rawAccounts = await this.fetchSquadronAccountList(page);
        this.logger.verbose(`獲取 ${rawAccounts.length} 個帳號當前狀態`);
        const { results } = await PromisePool.for(rawAccounts)
            .withConcurrency(5)
            .process(rawAccount => this.fetchUidFromReplay(rawAccount.name, rawAccount.link).then(id => ({ ...omit(rawAccount, "link"), id })))

        this.logger.verbose("爬蟲完畢");
        return results;
    }
}