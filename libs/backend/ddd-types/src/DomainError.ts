type DomainErrorProps = {
    message: string;
    error?: unknown;
}

export abstract class DomainError {
    protected constructor(private readonly props: DomainErrorProps) {
    }

    toString(): string {
        return `Error ${this.props.error ?? ""}: ${this.props.message}`;
    }
}

export namespace AppError {
    export class UnexpectedError extends DomainError {
        constructor(err: unknown) {
            super({ message: "Unexpected error occured", error: err });
        }
    }
}

