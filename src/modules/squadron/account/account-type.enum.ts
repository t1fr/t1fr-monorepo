import { ApplicationCommandOptionChoiceData } from "discord.js";

export enum AccountType {
  MAIN_CASUAL,
  MAIN_CORE,
  ALT_PRIVATE,
  MAIN_PUBLIC,
  ALT_PUBLIC,
  SPONSOR,
  ALT_SEMIPUBLIC,
}

const accountTypeDictionary = new Map([
	[AccountType.MAIN_CORE, ":regional_indicator_s: 聯隊戰主帳"],
	[AccountType.MAIN_CASUAL, ":regional_indicator_n: 休閒主帳"],
	[AccountType.ALT_PRIVATE, ":regional_indicator_a: 個人小帳"],
	[AccountType.MAIN_PUBLIC, ":regional_indicator_b: 公用主帳"],
	[AccountType.ALT_PUBLIC, ":regional_indicator_c: 公用小帳"],
	[AccountType.ALT_SEMIPUBLIC, ":regional_indicator_d: 半公用小帳"],
	[AccountType.SPONSOR, ":regional_indicator_x: 獎勵贊助者"],
]);

export function getAccountTypeOptions() {
	return [...accountTypeDictionary].map<ApplicationCommandOptionChoiceData>((pair) => ({ name: pair[1][0], value: pair[0] }));
}

export function getAccountTypeName(value: number) {
	return accountTypeDictionary.get(value) ?? "未知帳號類型";
}
