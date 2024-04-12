export abstract class AbstractDomainError<T extends Readonly<Record<string, string>>> {
    constructor(protected readonly type: keyof T, protected readonly message?: string) {
    }

    abstract toString(): string;
}