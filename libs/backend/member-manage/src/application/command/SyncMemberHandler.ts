import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainError, ZodParseError } from "@t1fr/backend/ddd-types";
import { Err, Result } from "ts-results-es";
import { Member, MemberId, MemberRepo } from "../../domain";
import { SyncMember, SyncMemberInput, SyncMemberOutput } from "./SyncMember";

@CommandHandler(SyncMember)
export class SyncMemberHandler implements ICommandHandler<SyncMember, SyncMemberOutput> {

    @MemberRepo()
    private readonly memberRepo!: MemberRepo;

    async execute(command: SyncMember): Promise<SyncMemberOutput> {
        const parseOrError = SyncMemberInput.safeParse(command.data);
        if (!parseOrError.success) return Err(ZodParseError.create(parseOrError.error));

        const data = parseOrError.data;

        const errors = new Array<Err<DomainError>>;
        const members = [];

        for (const { discordId, ...other } of data) {
            const id = new MemberId(discordId);
            const findByIdOrError = await this.memberRepo.findMemberById(id).promise;
            if (findByIdOrError.isErr()) {
                const createMemberOrError = Member.create(new MemberId(discordId), { ...other, isLeave: false });
                if (createMemberOrError.isOk()) members.push(createMemberOrError.value);
                else errors.push(createMemberOrError);
            } else {
                const member = findByIdOrError.value;
                const result = Result.all(member.changeType(other.type), member.updateInfo(other));
                if (result.isOk()) members.push(member);
                else errors.push(result);
            }
        }

        return this.memberRepo
            .save(members)
            .map(() => ({ errors: errors.map(it => it.error) }))
            .promise;
    }

}