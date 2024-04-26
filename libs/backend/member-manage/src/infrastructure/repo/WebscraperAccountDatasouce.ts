import { Logger, Provider } from "@nestjs/common";
import { PromisePool } from "@supercharge/promise-pool";
import { Configuration } from "@t1fr/backend/configs";
import { ZodParseError } from "@t1fr/backend/ddd-types";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { chain } from "lodash";
import { InjectBrowser } from "nestjs-puppeteer";
import { Browser, Page } from "puppeteer";
import { AsyncResult, Err, Ok, Result } from "ts-results-es";
import { v4 as uuidV4 } from "uuid";
import { z } from "zod";
import { Account, AccountDataSource, AccountId } from "../../domain";

dayjs.extend(customParseFormat);

type AccountListData = {
    name: string;
    link: string;
    personalRating: string;
    activity: string;
    joinDate: string;
}

const AccountDataFromWeb = z.object({
    id: z.string().min(1),
    name: z.string().transform(name => name?.match(/(?<name>[^\n@]+)(@psn|@live)?/)?.groups?.["name"]),
    personalRating: z.coerce.number().min(0),
    activity: z.coerce.number().min(0),
    joinDate: z.preprocess(it => dayjs(String(it), "DD.MM.YYYY").toDate(), z.date()),
});

export class WebscraperAccountDatasouce implements AccountDataSource {

    @InjectBrowser()
    private readonly browser!: Browser;

    private readonly logger = new Logger(WebscraperAccountDatasouce.name);

    private static readonly squadronGaijinPage = "https://warthunder.com/en/community/claninfo/The%20First%20Frontline%20Rangers";


    private static getUidFromHtmlId(htmlId: string) {
        return htmlId?.match(/player-(?<uid>\d+)/)?.groups?.["uid"] ?? null;
    }

    @Configuration("app.gaijin")
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
        await page.goto(WebscraperAccountDatasouce.squadronGaijinPage);
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
                    .filter((it): it is AccountListData => it.link !== undefined && it.name !== undefined);
            },
        );
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
            const id = WebscraperAccountDatasouce.getUidFromHtmlId(playerId);
            this.logger.verbose(`${name} 的 UID 為 ${id}`);
            return id;
        } catch (e) {
            this.logger.warn(`${name} 沒有重播`);
            return uuidV4();
        } finally {
            await page.close();
        }
    }

    fetch(exists: Account[]) {
        const dictionary = new Map(exists.map(it => [it.name, it]));
        this.logger.verbose("開始爬蟲");
        const promise =
            this.browser.pages()
                .then((pages) => pages.length === 0 ? this.browser.newPage() : pages[0])
                .then(async page => {
                    await this.login(page);
                    this.logger.verbose("登入成功");
                    const rawAccounts = await this.fetchSquadronAccountList(page);
                    this.logger.verbose("獲取帳號當前狀態");
                    const rawAccountsWithId = await PromisePool.for(rawAccounts).withConcurrency(5).process(async rawAccount => {
                        if (!rawAccount.name || !rawAccount.link) return { ...rawAccount, id: null };
                        const exist = dictionary.get(rawAccount.name);
                        if (exist) return { ...rawAccount, id: exist.id.value };
                        const id = await this.fetchUidFromReplay(rawAccount.name, rawAccount.link);
                        return { ...rawAccount, id };
                    });
                    const [acconts] = chain(rawAccountsWithId.results)
                        .map(data => {
                            const parseOrError = AccountDataFromWeb.safeParse(data);
                            if (!parseOrError.success) return Err(ZodParseError.create(parseOrError.error));
                            const { id, ...other } = parseOrError.data;
                            return Account.create(new AccountId(id), other);
                        })
                        .partition((result): result is Ok<Account> => result.isOk())
                        .value();
                    return Result.all(...acconts);
                });
        return new AsyncResult(promise);
    }
}

export const WebscraperAccountDatasourceProvider: Provider = { provide: AccountDataSource, useClass: WebscraperAccountDatasouce };