import { CommandHandler, type IInferredCommandHandler } from "@nestjs/cqrs";
import type { DomainError } from "@t1fr/backend/ddd-types";
import { type Result } from "ts-results-es";
import { MemberId, MemberRepo } from "../../domain";
import { UpdateMemberInfo } from "./UpdateMemberInfo";

@CommandHandler(UpdateMemberInfo)
export class UpdateMemberInfoHandler implements IInferredCommandHandler<UpdateMemberInfo> {
    @MemberRepo()
    private readonly memberRepo!: MemberRepo;

    async execute(command: UpdateMemberInfo): Promise<Result<void, DomainError>> {
        const parseOrError = command.parse()

        if (parseOrError.isErr()) return parseOrError;
        const { isOfficer, isSponsor, discordId, nickname, onVacation, avatarUrl } = parseOrError.value;
        return this.memberRepo
            .findMemberById(new MemberId(discordId))
            .andThen(member => {
                if (avatarUrl) member.avatarUrl = avatarUrl;
                if (isSponsor) member.isSponsor = isSponsor;
                if (isOfficer) member.isOfficer = isOfficer;
                if (nickname) member.nickname = nickname;
                if (onVacation) member.onVacation = onVacation;
                return this.memberRepo.save(member)
            })
            .map(() => { return; })
            .promise
    }
}