import type { Enum } from "@t1fr/backend/ddd-types";

export const AccountType = {
    S_SqbMain: "sqb_main",
    N_RelaxMain: "relax_main",
    A_PrivateAlt: "private_alt",
    C_PublicMain: "public_main",
    B_PublicAlt: "public_alt",
    D_SemipublicMain: "semipublic_main",
} as const;

export const AccountTypeNameMap: Record<AccountType, string> = {
    [AccountType.S_SqbMain]: "S 聯隊戰主帳",
    [AccountType.N_RelaxMain]: "N 休閒主帳",
    [AccountType.A_PrivateAlt]: "A 個人小帳",
    [AccountType.C_PublicMain]: "C 公用主帳",
    [AccountType.B_PublicAlt]: "B 公用小帳",
    [AccountType.D_SemipublicMain]: "D 半公用小帳"
}

export type AccountType = Enum<typeof AccountType>

