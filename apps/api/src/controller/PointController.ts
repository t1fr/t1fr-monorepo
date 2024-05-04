import { BadRequestException, Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import { MemberQueryRepo, PointType } from "@t1fr/backend/member-manage";
import { z } from "zod";
import { JwtGuard, OfficerGuard } from "../guard";

@Controller("point-logs")
@UseGuards(JwtGuard, OfficerGuard)
export class PointLogController {

    @MemberQueryRepo()
    private readonly memberRepo!: MemberQueryRepo;

    private static readonly PointTypes: PointType[] = ["absense", "penalty", "reward"]

    private static readonly getPointLogBody = z.object({
        skip: z.number().min(0),
        rows: z.number().min(1),
        memberId: z.string().optional()
    })

    @Post(":type")
    async getLogs(@Param("type") type: string, @Body() param: unknown) {
        const typeParseOrError = z.nativeEnum(PointType).safeParse(type)
        if (!typeParseOrError.success) throw new BadRequestException(`type 需為 ${PointLogController.PointTypes} 之一`);

        const bodyParseOrError = PointLogController.getPointLogBody.safeParse(param)
        if (!bodyParseOrError.success) throw new BadRequestException(`請求參數錯誤 ${bodyParseOrError.error}`);
        const { skip, rows, memberId } = bodyParseOrError.data;
        return this.memberRepo.getPointLogs(typeParseOrError.data, { skip, rows }, memberId);
    }
}
