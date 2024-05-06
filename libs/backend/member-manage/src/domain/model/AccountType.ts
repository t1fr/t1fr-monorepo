import type { Enum } from "@t1fr/backend/ddd-types";

export const AccountType = {
    S_SqbMain: "sqb_main",
    N_RelaxMain: "relax_main",
    A_PrivateAlt: "private_alt",
    C_PublicMain: "public_main",
    B_PublicAlt: "public_alt",
    D_SemipublicMain: "semipublic_main",
} as const;

export type AccountType = Enum<typeof AccountType>

