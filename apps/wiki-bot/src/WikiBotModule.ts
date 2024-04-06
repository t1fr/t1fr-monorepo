import { Module } from "@nestjs/common";
import { ConfigsModule } from "@lib/configs";

@Module({ imports: [ConfigsModule] })
export class WikiBotModule {
}
