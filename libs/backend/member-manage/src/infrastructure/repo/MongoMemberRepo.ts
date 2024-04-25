import { Provider } from "@nestjs/common";
import { AsyncActionResult, UnexpectedError } from "@t1fr/backend/ddd-types";
import { castArray, isUndefined, omitBy } from "lodash";
import { AnyBulkWriteOperation } from "mongoose";
import { AsyncResult, Err, Ok } from "ts-results-es";
import {
    Account,
    AccountId,
    AccountNotFoundError,
    FindAccountByIdResult,
    Member,
    MemberId,
    MemberNotFoundError,
    MemberRepo,
    NonRequiredAccountProps,
    SaveAccountsResult,
} from "../../domain";
import { AccountModel, AccountSchema, InjectAccountModel, InjectMemberModel, MemberModel } from "../mongoose";
import { AccountDoc, AccountMapper, MemberDoc, MemberMapper } from "./MemberMapper";

class MongoMemberRepo implements MemberRepo {


    @InjectAccountModel()
    private readonly accountModel!: AccountModel;

    @InjectMemberModel()
    private readonly memberModel!: MemberModel;

    save<T extends Member | Member[]>(data: T): AsyncActionResult<MemberId[]> {
        const memberDocs = new Array<MemberDoc>();
        const accountDocs = new Array<AccountDoc>();
        const models = castArray(data);
        models.forEach(member => {
            const { doc, accounts } = MemberMapper.toMongo(member);
            memberDocs.push(doc);
            accountDocs.push(...accounts);
        });

        const promise = Promise.all([
            this.memberModel.bulkWrite(memberDocs.map(({ discordId, ...other }) => ({
                updateOne: { filter: { discordId }, update: { $set: other }, upsert: true },
            }))),
            this.accountModel.bulkWrite(accountDocs.map(({ gaijinId, ...other }) => ({
                updateOne: { filter: { gaijinId }, update: { $set: other } },
            }))),
        ])
            .then(() => Ok(models.map(it => it.id)))
            .catch(reason => Err(UnexpectedError.create(reason)));

        return new AsyncResult(promise);
    }

    findMemberHaveAccount(accountId: AccountId): AsyncActionResult<Member> {
        throw new Error("Method not implemented.");
    }

    find(): AsyncActionResult<Member[]> {
        throw new Error("Method not implemented.");
    }

    findMemberById(memberId: MemberId): AsyncActionResult<Member> {
        const promise = this.memberModel.findOne({ discordId: memberId.value })
            .populate("accounts")
            .lean()
            .then(doc => doc === null ? Err(MemberNotFoundError.create(memberId)) : Ok(MemberMapper.fromMongo(doc)))
            .catch(reason => Err(UnexpectedError.create(reason)));
        return new AsyncResult(promise);
    }

    dumpAccounts(): AsyncActionResult<Account[]> {
        const promise = this.accountModel.find()
            .lean()
            .then(accounts => accounts.map(account => Account.rebuild(new AccountId(account.gaijinId), {
                name: account.name,
                type: account.type,
            })))
            .then(accounts => Ok(accounts));
        return new AsyncResult(promise);
    }

    saveAccounts(accounts: Account[]): AsyncActionResult<SaveAccountsResult> {
        const ids = accounts.map(it => it.id.value);
        const updateOnes = accounts.map<AnyBulkWriteOperation<AccountSchema>>(it => ({
            updateOne: {
                filter: { gaijinId: it.id.value },
                update: { $set: omitBy({ name: it.name, joinDate: it.joinDate, activity: it.activity, personalRating: it.personalRating }, isUndefined) },
                upsert: true,
            },
        }));
        const promise = this.accountModel.find({}, { gaijinId: true })
            .then(exists => {
                const needRemove = exists.filter(it => !ids.includes(it.gaijinId));
                return this.accountModel.bulkWrite([
                    { deleteMany: { filter: { gaijinId: { $in: needRemove } } } },
                    ...updateOnes,
                ]);
            })
            .then<Ok<SaveAccountsResult>>(bulkWriteResult => Ok({
                inserted: bulkWriteResult.insertedCount + bulkWriteResult.upsertedCount,
                modified: bulkWriteResult.modifiedCount,
                deleted: bulkWriteResult.deletedCount,
                ids: accounts.map(it => it.id),
            }));
        return new AsyncResult(promise);
    }

    findUnlinkedAccounts(): AsyncActionResult<Account[]> {
        throw new Error("Method not implemented.");
    }

    findAccountById(accountId: AccountId, selection?: (keyof NonRequiredAccountProps)[]): AsyncActionResult<FindAccountByIdResult> {
        const promise = this.accountModel.findOne({ gaijinId: accountId.value })
            .lean()
            .then(async doc => {
                if (doc === null) return Err(AccountNotFoundError.create(accountId));
                const account = AccountMapper.fromMongo(doc);
                const ok = Ok({ account: account });
                if (doc.ownerId === null) return ok;
                const findMemberOrError = await this.findMemberById(new MemberId(doc.ownerId)).promise;
                if (findMemberOrError.isOk()) return Ok({ account: account, member: findMemberOrError.value });
                if (findMemberOrError.error instanceof MemberNotFoundError) return ok;
                return findMemberOrError;
            })
            .catch(reason => Err(UnexpectedError.create(reason)));
        return new AsyncResult(promise);
    }
}

export const MongoMemberRepoProvider: Provider = { provide: MemberRepo, useClass: MongoMemberRepo };
