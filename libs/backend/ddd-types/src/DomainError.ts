import { Logger } from "@nestjs/common";
import { ZodError } from "zod";

type DomainErrorProps = {
    message?: string;
    context: { name: string };
    noLog?: true;
}

export abstract class DomainError {
    protected constructor(private readonly props: DomainErrorProps) {
        if (!props.noLog) Logger.error(props.message, props.context.name);
    }

    private get message() {
        return this.props.message ? `: ${this.props.message}` : "";
    }

    toString(): string {
        return `${this.props.context.name}${this.message}`;
    }
}

export class UnexpectedError extends DomainError {
    static create(err: unknown) {
        return new UnexpectedError({ context: UnexpectedError, message: `Unexpected error occured: ${err}` });
    }
}

export class ZodParseError extends DomainError {
    static create(zodError: ZodError) {
        return new ZodParseError({ context: ZodParseError, message: zodError.message });
    }
}

