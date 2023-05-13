import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
import { AccountRepo } from '../../repository/account.repo';
import { Context, createCommandGroupDecorator, NumberOption, Options, SlashCommandContext, StringOption, Subcommand } from 'necord';
import { MessageFlagsBitField } from 'discord.js';
import { AccountType, getAccountTypeChineseName } from '../../enum/AccountType';
import { MemberType } from '../../enum/MemberType';
import { AccountAutocompleteInterceptor } from './account.autocomplete';

class SetOwnershipOption {
  @NumberOption({
    name: 'account-id',
    description: '戰雷 ID',
    required: true,
    autocomplete: true,
  })
  accountNum: number;

  @StringOption({
    name: 'member',
    description: '擁有者 DC 帳號',
    required: true,
    autocomplete: true,
  })
  memberDiscordId: string;
}

class SetTypeOption {
  @NumberOption({
    name: 'account-id',
    description: '戰雷 ID',
    required: true,
    autocomplete: true,
  })
  accountNum: number;

  @NumberOption({
    name: 'account-type',
    description: '帳號類型',
    required: true,
    autocomplete: true,
  })
  accountType: number;
}

const AccountCommandGroup = createCommandGroupDecorator({
  name: 'account',
  description: '管理聯隊內的 WT 帳號',
});

@Injectable()
@AccountCommandGroup()
export class AccountCommand {
  private readonly logger = new Logger(AccountCommand.name);

  constructor(private accountRepo: AccountRepo) {
  }

  @Subcommand({
    name: 'fetch',
    description: '從網頁上爬帳號資料',
  })

  private async onFetch(@Context() [interaction]: SlashCommandContext) {
    await interaction.deferReply();
    const accounts = await this.accountRepo.fetchFromWeb(async progressBar => {
      await interaction.editReply({ content: progressBar });
    });
    if (accounts) {
      await interaction.editReply({ content: `成功更新 ${accounts.length} 位隊員資料` });
    } else {
      await interaction.editReply({ content: '更新失敗' });
    }
  }

  @Subcommand({
    name: 'set-owner',
    description: '指定擁有者',
  })
  @UseInterceptors(AccountAutocompleteInterceptor)
  private async onSetOwner(@Context() [interaction]: SlashCommandContext, @Options() { accountNum, memberDiscordId }: SetOwnershipOption) {
    const gameAccount = await this.accountRepo.update({ num: accountNum }, { owner: { connect: { discordId: memberDiscordId } } });
    await interaction.reply({
      content: `已成功設置 ID 為 ${gameAccount.id} 的帳號擁有者為 <@${memberDiscordId}>`,
      options: { flags: [MessageFlagsBitField.Flags.SuppressNotifications] },
    });
  }

  @Subcommand({ name: 'autolink', description: '自動根據 DC 暱稱後方的 ID 來連結帳號。如果帳號類型未定義，將由連結成員的身分組推斷' })
  private async onAutolink(@Context() [interaction]: SlashCommandContext) {
    await interaction.deferReply();
    const ownershipData = await this.accountRepo.joinOnId();
    const unlinkableId = ownershipData.filter(ownership => ownership.member_type === null).map(ownership => ownership.account_id);

    let successCount = 0;

    for (const ownership of ownershipData.filter(ownership => ownership.member_id !== null)) {
      // 只有找得到連結且帳號類型未知的才更新
      let accountType = undefined;
      if (ownership.member_type === MemberType.CORE) {
        accountType = AccountType.MAIN_CORE;
      } else if (ownership.member_type === MemberType.CASUAL) {
        accountType = AccountType.MAIN_CASUAL;
      }
      try {
        await this.accountRepo.update(
          { num: ownership.num },
          {
            owner: { connect: { discordId: ownership.member_id!! } },
            accountType: accountType,
          },
        );
        successCount++;
      } catch (e: any) {
        this.logger.error(e);
      }
    }

    this.logger.debug(unlinkableId);

    const content = [
      `可連結 ${ownershipData.length - unlinkableId.length} 個帳號`,
      `成功儲存 ${successCount} 個帳號`,
      `　　失敗 ${ownershipData.length - unlinkableId.length - successCount} 個帳號`,
      `另以下帳號無法建立連結`,
      '```',
      ...unlinkableId,
      '```',
    ].join('\n');
    await interaction.followUp({
      content: content,
    });
  }

  @UseInterceptors(AccountAutocompleteInterceptor)
  @Subcommand({ name: 'set-type', description: '設定帳號類型' })
  private async onSetType(@Context() [interaction]: SlashCommandContext, @Options() { accountNum, accountType }: SetTypeOption) {
    const gameAccount = await this.accountRepo.update({ num: accountNum }, { accountType: accountType });
    await interaction.reply({
      content: `已成功設置 ID 為 ${gameAccount.id} 的帳號類型為 ${getAccountTypeChineseName(accountType)}`,
      options: { flags: [MessageFlagsBitField.Flags.SuppressNotifications] },
    });
  }
}