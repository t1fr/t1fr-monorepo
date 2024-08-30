import type { AccountType } from "@t1fr/backend/member-manage";

export const AccountTypeOptions: Array<{ value: AccountType | null; label: string }> = [
    { value: "sqb_main", label: "S 聯隊戰主帳" },
    { value: "relax_main", label: "N 休閒主帳" },
    { value: "private_alt", label: "A 個人小帳" },
    { value: "public_main", label: "C 公用主帳" },
    { value: "public_alt", label: "B 公用小帳" },
    { value: "semipublic_main", label: "D 半公用主帳" },
];

export const AccountTypeOptionsWithNull = AccountTypeOptions.concat({ value: null, label: "沒有指定" })