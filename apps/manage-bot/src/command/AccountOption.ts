import { AccountType } from "@t1fr/backend/member-manage";
import { GuildMember } from "discord.js";
import { BooleanOption, MemberOption, StringOption } from "necord";

const AccountTypeChoice: Record<AccountType, string> = {
    private_alt: "🇦 個人小帳",
    public_alt: "🇧 公用小帳",
    public_main: "🇨 公用主帳",
    relax_main: "🇳 休閒主帳",
    semipublic_main: "🇩 半公用主帳",
    sqb_main: "🇸 聯隊戰主帳",
};


export class SetAccountTypeOption {
    @StringOption({ name: "account-id", description: "戰雷 ID", required: true, autocomplete: true })
    accountId!: string;

    @StringOption({
        name: "account-type",
        description: "帳號類型",
        required: true,
        choices: Object.keys(AccountTypeChoice).map(type => ({ name: type, value: type })),
    })
    accountType!: string;
}

export class SetOwnershipOption {
    @StringOption({ name: "account-id", description: "戰雷 ID", required: true, autocomplete: true })
    accountId!: string;

    @MemberOption({ name: "member", description: "要指定的成員", required: true })
    guildMember!: GuildMember;
}

export class CalculateRewardPointOption {
    @BooleanOption({ name: "simulate", description: "是否試算，不紀錄結果", required: true })
    isSimulate = true;
    @BooleanOption({ name: "verbose", description: "是否顯示原因" })
    verbose = false;
}
