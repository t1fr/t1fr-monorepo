import { CommandHandler, type IInferredCommandHandler } from "@nestjs/cqrs";
import type { DomainError } from "@t1fr/backend/ddd-types";
import { Err, Ok, type Result } from "ts-results-es";
import { Member, MemberNoAccountError, MemberRepo, RewardPointCalculateService } from "../../domain";
import { CalculateSeasonResult, type CalculateSeasonResultOutput } from "./CalculateSeasonResult";

@CommandHandler(CalculateSeasonResult)
export class CalculateSeasonResultHandler implements IInferredCommandHandler<CalculateSeasonResult> {

    @MemberRepo()
    private readonly memberRepo!: MemberRepo;

    async execute(command: CalculateSeasonResult): Promise<Result<CalculateSeasonResultOutput, DomainError>> {
        const parseResult = command.parse()
        if (parseResult.isErr()) return parseResult;

        const { year, seasonIndex, write, type } = parseResult.value;

        return this.memberRepo.restoreFromBackup(year, seasonIndex)
            .andThen(async members => {
                const noAccountMembers = members.filter(member => member.accounts.length === 0)
                if (noAccountMembers.length > 0) return Err(MemberNoAccountError.create(noAccountMembers.map(it => it.id)))

                const calcualteResult = this.calculateReward(members)

                if (calcualteResult.isErr()) return calcualteResult;

                if (write) await this.memberRepo.save(members).promise;

                return calcualteResult
            })
            .promise;

    }

    private calculateReward(members: Member[]) {
        const calculateService = new RewardPointCalculateService()

        const calculateResult = calculateService.calculate(members)

        if (calculateResult.isErr()) return calculateResult;

        const result = new Map<number, Array<{ memberId: string, comment: string }>>()
        for (const member of members) {
            const logs = calculateResult.value[member.id.value];
            if (logs === undefined) continue;

            logs.filter(log => member.updatePoint(log)).forEach(log => {
                const records = result.get(log.props.delta) ?? []
                records.push({ memberId: member.id.value, comment: log.props.comment ?? "" })
                result.set(log.props.delta, records)
            })
        }

        return Ok(Array.from(result.entries()).map(([group, records]) => ({ group, records })))
    }

}