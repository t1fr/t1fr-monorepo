import { Command as TypedCommand, Query as TypedQuery } from "@nestjs-architects/typed-cqrs";
import { Err, Ok, Result } from "ts-results-es";
import { z } from "zod";
import { DomainError, ZodParseError } from "./DomainError";

type HaveZodSchema = { schema: z.ZodType }
type ToUnknown<T> =
    T extends Date ? unknown
        : T extends object ? { [key in keyof T]: unknown }
            : unknown

export abstract class Command<T extends HaveZodSchema, R> extends TypedCommand<Result<R, DomainError>> {
    constructor(private readonly data: ToUnknown<z.infer<T["schema"]>>) {
        super();
    }

    parse(): Result<z.infer<T["schema"]>, ZodParseError> {
        const parseOrError = this.schema.safeParse(this.data);
        if (parseOrError.success) return Ok(parseOrError.data);
        return Err(ZodParseError.create(parseOrError.error));
    }

    abstract get schema(): T["schema"];
}

export abstract class Query<T extends HaveZodSchema, R> extends TypedQuery<Result<R, DomainError>> {
    constructor(private readonly data: ToUnknown<z.infer<T["schema"]>>) {
        super();
    }

    parse(): Result<z.infer<T["schema"]>, ZodParseError> {
        const parseOrError = this.schema.safeParse(this.data);
        if (parseOrError.success) return Ok(parseOrError.data);
        return Err(ZodParseError.create(parseOrError.error));
    }

    abstract get schema(): T["schema"];
}