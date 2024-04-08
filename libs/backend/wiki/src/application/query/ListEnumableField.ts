import { Command } from "@t1fr/backend/ddd-types";
import { EnumFields } from "../../domain";

export type ListEnumableFieldResult = string[]

export class ListEnumableField extends Command<EnumFields> {
}
