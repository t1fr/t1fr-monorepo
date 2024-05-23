import { BadRequestException, Body, Controller, Get, Inject, Post, Query, UnprocessableEntityException } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { FindCurrentSeason, SearchMatchRecords, SubmitMatches } from "@t1fr/backend/sqb";

@Controller("sqb")
export class SqbController {

    @Inject()
    private readonly queryBus!: QueryBus;

    @Inject()
    private readonly commandBus!: CommandBus;


    @Get("battle-ratings")
    async getBattleRatings() {
        const result = await this.queryBus.execute(new FindCurrentSeason())
        return result.map(season => season.sections.map(it => it.battleRating.toFixed(1)))
    }

    @Post("matches")
    async submitMatches(@Body() data: unknown) {
        if (typeof data !== "object" || data === null) throw new UnprocessableEntityException("資料格式錯誤，應包含 battleRating, matches")
        if (!("matches" in data && "battleRating" in data)) throw new UnprocessableEntityException("資料格式錯誤，應包含 battleRating, matches")

        return this.commandBus.execute(new SubmitMatches(data))
    }

    @Get("matches")
    async searchMatches(@Query() query: Record<"br" | "enemyName" | "ourName", string | undefined>) {

        if (!query.br) throw new BadRequestException("應該提供分房 br 參數")
        if (!query.ourName) throw new BadRequestException("應該提供我方聯隊名稱 ourName 參數")
        if (!query.enemyName) throw new BadRequestException("應該提供敵方聯隊名稱 enemyName 參數")

        return this.queryBus.execute(new SearchMatchRecords(query))
    }

}