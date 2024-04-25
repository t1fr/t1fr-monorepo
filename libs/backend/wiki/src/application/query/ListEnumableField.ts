import { Query } from "@t1fr/backend/ddd-types";
import { z } from "zod";
import { EnumFields } from "../../domain";

export class ListEnumableField extends Query<ListEnumableField, string[]> {
    override get schema() {
        return ListEnumableField.schema;
    }

    private static schema = z.enum(EnumFields);
}
