import { Injectable, Logger } from '@nestjs/common';
import { AutocompleteInterceptor } from 'necord';
import { AccountRepo } from '../../repository/account.repo';
import { MemberRepo } from '../../repository/member.repo';
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from 'discord.js';
import { getAccountTypeOptions } from '../../enum/AccountType';

@Injectable()
export class AccountAutocompleteInterceptor extends AutocompleteInterceptor {
  private readonly logger = new Logger(AccountAutocompleteInterceptor.name);

  constructor(private accountRepo: AccountRepo, private memberRepo: MemberRepo) {
    super();
  }

  async transformOptions(interaction: AutocompleteInteraction): Promise<void> {
    const focused = interaction.options.getFocused(true);
    let options: ApplicationCommandOptionChoiceData[] = [];

    const inputValue = focused.value.toString();

    if (focused.name === 'account-id') {
      this.logger.log('account-id');
      options = this.accountRepo.selectAllNumAndId().filter(choice => choice.id.includes(inputValue))
        .slice(0, 25)
        .map(choice => ({ name: choice.id, value: choice.num }));
    }
    if (focused.name === 'member') {
      options = this.memberRepo.selectAllIdAndName().filter(choice => choice.nickname.includes(inputValue))
        .slice(0, 25)
        .map(choice => ({ name: choice.nickname, value: choice.discordId }));
    }

    if (focused.name === 'account-type') {
      options = getAccountTypeOptions();
    }

    return interaction.respond(options);
  }
}