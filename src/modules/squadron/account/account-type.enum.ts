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

const accountTypeDictionary = new Map<AccountType, string>([
	[AccountType.MAIN_CORE, "🇸 聯隊戰主帳"],
	[AccountType.MAIN_CASUAL, "🇳 休閒主帳"],
	[AccountType.ALT_PRIVATE, "🇦 個人小帳"],
	[AccountType.MAIN_PUBLIC, "🇨 公用主帳"],
	[AccountType.ALT_PUBLIC, "🇧 公用小帳"],
	[AccountType.ALT_SEMIPUBLIC, "🇩 半公用小帳"],
	[AccountType.SPONSOR, "🇽 獎勵贊助者"],
]);

export function getAccountTypeOptions() {
	return [...accountTypeDictionary].map<ApplicationCommandOptionChoiceData>((pair) => ({ name: pair[1], value: pair[0] }));
}

export function getAccountTypeName(value: number) {
	return accountTypeDictionary.get(value) ?? "未知帳號類型";
}
