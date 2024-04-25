import { CommandHandler, IInferredCommandHandler } from "@nestjs/cqrs";
import { Ok } from "ts-results-es";
import { AccountId, MemberId, MemberRepo } from "../../domain";
import { AssignAccountOwner } from "./AssignAccountOwner";

@CommandHandler(AssignAccountOwner)
export class AssignAccountOwnerHandler implements IInferredCommandHandler<AssignAccountOwner> {
    @MemberRepo()
    private readonly memberRepo!: MemberRepo;

    async execute(command: AssignAccountOwner) {
        const parseOrError = command.parse();
        if (parseOrError.isErr()) return parseOrError;
        const memberId = new MemberId(parseOrError.value.memberId);
        const accountId = new AccountId(parseOrError.value.accountId);

        const findMemberOrError = await this.memberRepo.findMemberById(memberId).promise;

        if (findMemberOrError.isErr()) return findMemberOrError;

        const newOwner = findMemberOrError.value;

        const assignedAccount = newOwner.findAccount(accountId);
        if (assignedAccount) return Ok({ newOwnerId: newOwner.id.value, account: { id: accountId.value, name: assignedAccount.name ?? "" } });
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
            .map(() => ({ newOwnerId: memberId.value, account: { id: accountId.value, name: account.name ?? "", oldOwnerId: oldOwner?.id.value } }));
    }

}