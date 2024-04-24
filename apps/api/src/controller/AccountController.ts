import { BadRequestException, Body, Controller, Get, HttpStatus, Inject, Param, Patch, Res, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiResponse } from "@nestjs/swagger";
import { AssignAccountOwner, ListAccountDTO, MemberQueryRepo, SetAccountType } from "@t1fr/backend/member-manage";
import { Response } from "express";
import { JwtGuard, OfficerGuard } from "../guard";

type UpdateAccountDTO = { type?: string | null; ownerId?: string; }

@Controller("accounts")
export class AccountController {

    @Inject()
    private readonly commandBus!: CommandBus;

    @MemberQueryRepo()
    private readonly memberRepo!: MemberQueryRepo;

    @Get()
    @UseGuards(JwtGuard, OfficerGuard)
    @ApiResponse({ description: "聯隊內的帳號資訊，延遲最長 4 小時", type: ListAccountDTO, isArray: true })
    async getAccounts() {
        return this.memberRepo.listAccounts();
    }

    @Patch(":id")
    @UseGuards(JwtGuard, OfficerGuard)
    async updateAccount(@Param("id") id: string, @Body() data: UpdateAccountDTO, @Res() response: Response) {
        if (data.type !== undefined && data.ownerId !== undefined) throw new BadRequestException("不可同時設定帳號類型與擁有者");
        if (data.type !== undefined) return await this.commandBus.execute(new SetAccountType({}));
        if (data.ownerId !== undefined) return await this.commandBus.execute(new AssignAccountOwner({ accountId: id, memberId: data.ownerId }));

        return response.status(HttpStatus.NO_CONTENT);
    }
}
