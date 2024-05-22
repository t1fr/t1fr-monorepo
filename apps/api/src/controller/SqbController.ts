import { BadRequestException, Body, Controller, Get, Inject, Post, Query, UnprocessableEntityException } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { FindCurrentSeason, SubmitMatches } from "@t1fr/backend/sqb";

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
    async searchMatches(@Query("br") br?: string, @Query("name") enemyName?: string) {

        if (!br) throw new BadRequestException("應該提供分房 br 參數")
        if (!enemyName) throw new BadRequestException("應該提供聯隊名稱 name 參數")

        throw Error("Not Implemented")
    }

}