import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NecordModule } from 'necord';
import { IntentsBitField } from 'discord.js';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from 'joi';
import { RepositoryModule } from './repository/repository.module';
import { DiscordBotModule } from './bot/bot.module';
import { GlobalHttpModule } from './http/http.module';
import PointModule from './points/point.module';
import ApiModule from './api/api.module';

const intents = [
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildVoiceStates,
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMembers,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.MessageContent,
];

const validationSchema = Joi.object({
  'YAML_CONFIG_FILE': Joi.string().required(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: validationSchema,
    }),
    NecordModule.forRoot({
      token: process.env.DISCORD_BOT_TOKEN ?? '',
      intents: intents,
    }),
    GlobalHttpModule,
    RepositoryModule,
    DiscordBotModule,
    PointModule,
    ApiModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
}
