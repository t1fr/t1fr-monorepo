import { CommandHandler, IInferredCommandHandler } from "@nestjs/cqrs";
import { Result } from "ts-results-es";
import { Member, MemberId, MemberRepo } from "../../domain";
import { SyncMember } from "./SyncMember";

@CommandHandler(SyncMember)
export class SyncMemberHandler implements IInferredCommandHandler<SyncMember> {

    @MemberRepo()
    private readonly memberRepo!: MemberRepo;

    async execute(command: SyncMember) {
        const parseOrError = command.parse();
        if (parseOrError.isErr()) return parseOrError;

        const data = parseOrError.value;

        const members = new Array<Member>();

        for (const { discordId, ...other } of data) {
            const id = new MemberId(discordId);
            const findByIdOrError = await this.memberRepo.findMemberById(id).promise;
            if (findByIdOrError.isErr()) {
                const createMemberOrError = Member.create(new MemberId(discordId), { ...other, isLeave: false });
                if (createMemberOrError.isOk()) members.push(createMemberOrError.value);
                else return createMemberOrError
            } else {
                const member = findByIdOrError.value;
                const result = Result.all(member.changeType(other.type), member.updateInfo(other));
                if (result.isOk()) members.push(member);
                else return result;
            }
        }

        return this.memberRepo
            .save(members, true)
            .map((ids) => ({ ids: ids.map(it => it.value) }))
            .promise;
    }

}