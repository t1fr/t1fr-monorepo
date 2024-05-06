import { CommandHandler, type IInferredCommandHandler } from "@nestjs/cqrs";
import { DomainError } from "@t1fr/backend/ddd-types";
import { Result } from "ts-results-es";
import { MemberRepo } from "../../domain";
import { Backup, type BackupOutput } from "./Backup";

@CommandHandler(Backup)
export class BackupHandler implements IInferredCommandHandler<Backup> {

    @MemberRepo()
    private readonly memberRepo!: MemberRepo;

    execute(): Promise<Result<BackupOutput, DomainError>> {
        const now = new Date();
        const year = now.getFullYear();
        const seasonIndex = Math.floor(now.getMonth() / 2) + 1;

        return this.memberRepo
            .backup(year, seasonIndex)
            .map(() => ({ year, seasonIndex }))
            .promise;
    }
}