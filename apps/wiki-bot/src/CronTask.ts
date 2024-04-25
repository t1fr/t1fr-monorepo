import { Inject, Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ScrapeDatamine } from "@t1fr/backend/wiki";
import { Result } from "ts-results-es";

@Injectable()
export class CronTask implements OnApplicationBootstrap {

    @Inject()
    private readonly commandBus!: CommandBus;

    private readonly logger = new Logger(CronTask.name);

    @Cron(CronExpression.EVERY_DAY_AT_8AM)
    async syncDatabase() {
        const result = await this.commandBus.execute<ScrapeDatamine, Result<number, string>>(new ScrapeDatamine());
        if (result.isOk()) this.logger.log(`已更新 ${result.value} 筆`);
        else this.logger.error(result.error);
    }

    async onApplicationBootstrap() {
        setTimeout(() => this.syncDatabase(), 10000);
    }
}
