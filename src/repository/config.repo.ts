import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { BooleanOption, Context, NumberOption, Options, RoleOption, SlashCommand, SlashCommandContext, StringOption } from 'necord';
import { PrismaService } from '../prisma.service';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { flattenObject } from 'flatten-anything';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { Role } from 'discord.js';

class SetValueOptions {
  @StringOption({
    name: 'key',
    description: '設定的鍵，必須已存在',
    required: true,
  })
  key: string;
  @StringOption({
    name: 'string',
    description: '字串值',
  })
  stringValue: string;

  @NumberOption({
    name: 'number',
    description: '數值',
  })
  numberValue: number;

  @BooleanOption({
    name: 'boolean',
    description: '布林值',
  })
  booleanValue: boolean;

  @RoleOption({
    name: 'role',
    description: '身分組',
  })
  roleValue: Role;
}

@Injectable()
export class ConfigRepo implements OnModuleInit {
  private readonly logger: Logger = new Logger(ConfigRepo.name);
  private cache: Record<string, string>;

  constructor(private prisma: PrismaService, private configService: ConfigService) {
  }


  @SlashCommand({ name: 'set-value', description: '設定新值' })
  async onSetValue(@Context() [interaction]: SlashCommandContext, @Options() { key, roleValue, stringValue, numberValue, booleanValue }: SetValueOptions) {
    return interaction.reply({
      content: '還未實作',
    });
  }

  public getValue(key: string) {
    return this.cache[key];
  }

  async onModuleInit(): Promise<void> {
    const yamlObject = yaml.load(fs.readFileSync(path.resolve(__dirname, this.configService.get<string>('YAML_CONFIG_FILE')!!), 'utf8')) as object;
    this.cache = flattenObject(yamlObject);
    for (const [key, value] of Object.entries(this.cache)) {
      const config = await this.prisma.config.findFirst({ where: { key: key } });
      if (config) {
        this.logger.log(`find config ${config.key}: ${config.value}`);
        this.cache[config.key] = config.value;
      } else {
        this.logger.log(`save config ${key}: ${value}`);
        await this.prisma.config.create({ data: { key: key, value: value } });
      }
    }
  }
}

