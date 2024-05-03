import { Command } from "@t1fr/backend/ddd-types";
import { z } from "zod";
import { AccountType } from "../../domain";

export class SetAccountType extends Command<SetAccountType, SetAccountTypeOutput> {
    override get schema() {
        return SetAccountType.schema;
    }

    private static schema = z.object({
        id: z.string(),
        type: z.nativeEnum(AccountType),
    });
}

export  type SetAccountTypeOutput = { id: string, type: AccountType }