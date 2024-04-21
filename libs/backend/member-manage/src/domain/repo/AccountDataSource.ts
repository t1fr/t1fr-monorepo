import { Inject } from "@nestjs/common";
import { DomainError } from "@t1fr/backend/ddd-types";
import { AsyncResult } from "ts-results-es";
import { Account } from "../model";

export const AccountDataSource = () => Inject(AccountDataSource);

export interface AccountDataSource {
    fetch(exists: Account[]): AsyncResult<Account[], DomainError>;
}