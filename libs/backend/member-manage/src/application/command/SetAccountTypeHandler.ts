import { CommandHandler, IInferredCommandHandler } from "@nestjs/cqrs";
import { DomainError } from "@t1fr/backend/ddd-types";
import { Result } from "ts-results-es";
import { AccountId, MemberRepo } from "../../domain";
import { SetAccountType, SetAccountTypeOutput } from "./SetAccountType";

@CommandHandler(SetAccountType)
export class SetAccountTypeHandler implements IInferredCommandHandler<SetAccountType> {
    @MemberRepo()
    private readonly memberRepo!: MemberRepo;


    async execute(command: SetAccountType): Promise<Result<SetAccountTypeOutput, DomainError>> {
        const parseOrError = command.parse()

        if (parseOrError.isErr()) return parseOrError;

        const { id, type } = parseOrError.value;
        const accountId = new AccountId(id)

        const findMemberOrError = await this.memberRepo.findMemberByAccountId(accountId).promise;

        if (findMemberOrError.isErr()) return findMemberOrError;

        const member = findMemberOrError.value;


        const changeOrError = member.changeAccountType(accountId, type)


        if (changeOrError.isErr()) return changeOrError;


        return this.memberRepo.save(member).map(() => ({ id: accountId.value, type })).promise;
    }

}