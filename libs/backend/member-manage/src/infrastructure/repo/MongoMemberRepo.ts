import { Provider } from "@nestjs/common";
import { UnexpectedError } from "@t1fr/backend/ddd-types";
import { castArray, isUndefined, omitBy } from "lodash";
import { AnyBulkWriteOperation } from "mongoose";
import { AsyncResult, Err, Ok } from "ts-results-es";
import { Account, AccountId, Member, MemberId, MemberNotFoundError, MemberRepo, MemberRepoResult, SaveAccountsResult } from "../../domain";
import { AccountModel, AccountSchema, InjectAccountModel, InjectMemberModel, MemberModel } from "../mongoose";
import { AccountDoc, MemberDoc, MemberMapper } from "./MemberMapper";

class MongoMemberRepo implements MemberRepo {
    @InjectAccountModel()
    private readonly accountModel!: AccountModel;

    @InjectMemberModel()
    private readonly memberModel!: MemberModel;

    save<T extends Member | Member[]>(data: T): MemberRepoResult<void> {
        const memberDocs = new Array<MemberDoc>();
        const accountDocs = new Array<AccountDoc>();
        castArray(data).forEach(member => {
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
            .then(() => Ok.EMPTY)
            .catch(reason => Err(UnexpectedError.create(reason)));

        return new AsyncResult(promise);
    }

    findMemberHaveAccount(accountId: AccountId): MemberRepoResult<Member> {
        throw new Error("Method not implemented.");
    }

    find(): MemberRepoResult<Member[]> {
        throw new Error("Method not implemented.");
    }

    findById(memberId: MemberId): MemberRepoResult<Member> {
        const promise = this.memberModel.findOne({ discordId: memberId.value })
            .populate("accounts")
            .lean()
            .then(doc => doc === null ? Err(MemberNotFoundError.create(memberId)) : Ok(MemberMapper.fromMongo(doc)))
            .catch(reason => Err(UnexpectedError.create(reason)));
        return new AsyncResult(promise);
    }

    dumpAccounts(): MemberRepoResult<Account[]> {
        const promise = this.accountModel.find()
            .lean()
            .then(accounts => accounts.map(account => Account.rebuild(new AccountId(account.gaijinId), {
                name: account.name,
                type: account.type,
            })))
            .then(accounts => Ok(accounts));
        return new AsyncResult(promise);
    }

    saveAccounts(accounts: Account[]): MemberRepoResult<SaveAccountsResult> {
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
            }));
        return new AsyncResult(promise);
    }

    findUnlinkedAccounts(): MemberRepoResult<Account[]> {
        throw new Error("Method not implemented.");
    }
}

export const MongoMemberRepoProvider: Provider = { provide: MemberRepo, useClass: MongoMemberRepo };
