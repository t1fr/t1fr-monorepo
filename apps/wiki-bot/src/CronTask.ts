import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ScapeDatamine } from "@t1fr/backend/wiki";

@Injectable()
export class CronTask implements OnApplicationBootstrap {

    @Inject()
    private readonly commandBus: CommandBus;

    @Cron(CronExpression.EVERY_DAY_AT_8AM)
    async syncDatabase() {
        await this.commandBus.execute(new ScapeDatamine());
    }

    async onApplicationBootstrap() {
        setTimeout(() => this.syncDatabase(), 20000);
    }
}
