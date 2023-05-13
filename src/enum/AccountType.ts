import { ApplicationCommandOptionChoiceData } from 'discord.js';

export enum AccountType {
  MAIN_CASUAL,
  MAIN_CORE,
  ALT_PRIVATE,
  MAIN_PUBLIC,
  ALT_PUBLIC,
  SPONSOR
}

const accountTypeDictionary = new Map([
  [AccountType.MAIN_CORE, ['聯隊戰主帳', 'SQB Main']],
  [AccountType.MAIN_CASUAL, ['休閒主帳', 'Casual Main']],
  [AccountType.ALT_PRIVATE, ['個人小帳', 'Private Alt']],
  [AccountType.MAIN_PUBLIC, ['公用主帳', 'Public Main']],
  [AccountType.ALT_PUBLIC, ['公用小帳', 'Public Alt']],
  [AccountType.SPONSOR, ['獎勵贊助者', 'Sponsor']],
]);

export function getAccountTypeOptions() {
  return [...accountTypeDictionary].map<ApplicationCommandOptionChoiceData>(pair => ({ name: pair[1][0], value: pair[0] }));
}

export function getAccountTypeChineseName(value: number) {
  return accountTypeDictionary.get(value)!![0] ?? '未知帳號類型';
}

export function getAccountTypeEnglishName(value: number) {
  return accountTypeDictionary.get(value)!![1] ?? '未知帳號類型';
}