import { BadRequestException, Body, Controller, Get, Inject, Param, Patch, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiResponse } from "@nestjs/swagger";
import { AssignAccountOwner, ListAccountDTO, MemberQueryRepo, SetAccountType, SyncAccount } from "@t1fr/backend/member-manage";
import { JwtGuard, OfficerGuard } from "../guard";
import { AccountDataScraper } from "../service";

type UpdateAccountDTO = { type?: string | null; ownerId?: string; }

@Controller("accounts")
export class AccountController {

    @Inject()
    private readonly commandBus!: CommandBus;

    @MemberQueryRepo()
    private readonly memberRepo!: MemberQueryRepo;

    @Inject()
    private readonly accountDataScraper!: AccountDataScraper;

    @Get("sync")
    private async sync() {
        const data = await this.accountDataScraper.fetch();
        this.commandBus.execute(new SyncAccount(data))
    }


    @Get()
    @UseGuards(JwtGuard, OfficerGuard)
    @ApiResponse({ description: "聯隊內的帳號資訊，延遲最長 4 小時", type: ListAccountDTO, isArray: true })
    async getAccounts() {
        return this.memberRepo.listAccounts();
    }

    @Patch(":id")
    @UseGuards(JwtGuard, OfficerGuard)
    updateAccount(@Param("id") id: string, @Body() data: UpdateAccountDTO) {
        if (data.type !== undefined && data.ownerId !== undefined) throw new BadRequestException("不可同時設定帳號類型與擁有者");
        if (data.type === undefined && data.ownerId === undefined) throw new BadRequestException("無效的請求");
        if (data.type !== undefined) return this.commandBus.execute(new SetAccountType({ id: id, type: data.type }));
        if (data.ownerId !== undefined) return this.commandBus.execute(new AssignAccountOwner({ accountId: id, memberId: data.ownerId }));
    }
}
