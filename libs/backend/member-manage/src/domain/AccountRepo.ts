import { Inject } from "@nestjs/common";
import { Result } from "ts-results-es";
import { Account } from "./model/Account";

export const AccountRepo = () => Inject(AccountRepo);

export interface AccountRepo {
    scrape(): Promise<Result<Account[], any>>;
}