import { Module } from '@nestjs/common';
import { AccountCommand } from './account.command';
import { AccountAutocompleteInterceptor } from './account.autocomplete';

@Module({
  providers: [AccountCommand, AccountAutocompleteInterceptor],
})

export class AccountModule {
}