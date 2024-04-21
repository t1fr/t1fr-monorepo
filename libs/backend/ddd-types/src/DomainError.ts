import { ZodError } from "zod";

type DomainErrorProps = {
    message?: string;
}

export abstract class DomainError {
    protected constructor(private readonly props: DomainErrorProps) {
    }

    protected abstract readonly context: string;

    private get message() {
        return this.props.message ? `: ${this.props.message}` : "";
    }

    toString(): string {
        return `Error[${this.context}]${this.message}\n${new Error().stack}`;
    }
}

export class UnexpectedError extends DomainError {
    protected override context: string = UnexpectedError.name;

    static create(err: unknown) {
        return new UnexpectedError({ message: `Unexpected error occured: ${err}` });
    }
}

export class ZodParseError extends DomainError {
    protected override context: string = ZodParseError.name;

    static create(zodError: ZodError) {
        return new ZodParseError({ message: zodError.message });
    }
}

