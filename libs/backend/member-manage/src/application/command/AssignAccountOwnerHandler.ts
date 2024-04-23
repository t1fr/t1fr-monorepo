import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ZodParseError } from "@t1fr/backend/ddd-types";
import { Err, Ok } from "ts-results-es";
import { AccountId, MemberId, MemberRepo } from "../../domain";
import { AssignAccountOwner, AssignAccountOwnerInput, AssignAccountOwnerResult } from "./AssignAccountOwner";

@CommandHandler(AssignAccountOwner)
export class AssignAccountOwnerHandler implements ICommandHandler<AssignAccountOwner, AssignAccountOwnerResult> {
    @MemberRepo()
    private readonly memberRepo!: MemberRepo;

    async execute(command: AssignAccountOwner): Promise<AssignAccountOwnerResult> {
        const parseResult = AssignAccountOwnerInput.safeParse(command.data);
        if (!parseResult.success) return Err(ZodParseError.create(parseResult.error));
        const memberId = new MemberId(parseResult.data.memberId);
        const accountId = new AccountId(parseResult.data.accountId);

        const findMemberOrError = await this.memberRepo.findMemberById(memberId).promise;

        if (findMemberOrError.isErr()) return findMemberOrError;

        const newOwner = findMemberOrError.value;

        const assignedAccount = newOwner.findAccount(accountId);
        if (assignedAccount) return Ok({ accountName: assignedAccount.name ?? "" });
        const findAccountOrError = await this.memberRepo.findAccountById(accountId).promise;

        if (findAccountOrError.isErr()) return findAccountOrError;

        const { owner: oldOwner, account } = findAccountOrError.value;
        const unLinkAccountOrError = oldOwner ? oldOwner.removeAccount(account.id) : Ok.EMPTY;

        return unLinkAccountOrError
            .andThen(() => newOwner.assignAccount(account))
            .map(() => {
                if (oldOwner) this.memberRepo.save(oldOwner);
                this.memberRepo.save(newOwner);
            })
            .map(() => ({ accountName: account.name ?? "" }));
    }

}