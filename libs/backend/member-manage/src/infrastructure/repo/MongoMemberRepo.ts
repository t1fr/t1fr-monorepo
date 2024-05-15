import type { Provider } from "@nestjs/common";
import type { AsyncActionResult } from "@t1fr/backend/ddd-types";
import { castArray, groupBy, isUndefined, keyBy, mapValues, omitBy } from "lodash-es";
import type { AnyBulkWriteOperation } from "mongoose";
import { AsyncResult, Err, Ok } from "ts-results-es";
import { Account, AccountId, AccountNoOwnerError, AccountNotFoundError, type FindAccountByIdResult, Member, MemberId, MemberNotFoundError, MemberRepo, type SaveAccountsResult } from "../../domain";
import { type AccountModel, AccountSchema, type BackupModel, InjectAccountModel, InjectBackupModel, InjectMemberModel, InjectPointLogModel, type MemberModel, type PointLogModel, PointLogSchema } from "../mongoose";
import { type AccountDoc, AccountMapper, type MemberDoc, MemberMapper, type PointDoc } from "./MemberMapper";

class MongoMemberRepo implements MemberRepo {
    @InjectAccountModel()
    private readonly accountModel!: AccountModel;

    @InjectMemberModel()
    private readonly memberModel!: MemberModel;

    @InjectBackupModel()
    private readonly backupModel!: BackupModel;

    @InjectPointLogModel()
    private readonly pointLogModel!: PointLogModel;

    save<T extends Member | Member[]>(data: T, markLeaveOnNoUpdate?: true): AsyncActionResult<MemberId[]> {
        const memberDocs = new Array<MemberDoc>();
        const accountDocs = new Array<AccountDoc>();
        const pointDocs = new Array<PointDoc>();
        const models = castArray(data);
        models.forEach(member => {
            const { doc, accounts, logs } = MemberMapper.toMongo(member);
            memberDocs.push(doc);
            accountDocs.push(...accounts);
            pointDocs.push(...logs)
        });

        const memberWrite: AnyBulkWriteOperation[] = memberDocs.map(({ discordId, ...other }) => ({
            updateOne: { filter: { discordId }, update: { $set: { ...other, isLeave: false } }, upsert: true },
        }))

        if (markLeaveOnNoUpdate) memberWrite.unshift({ updateMany: { filter: {}, update: { $set: { isLeave: true } } } })

        const promise = Promise.all([
            this.memberModel.bulkWrite(memberWrite),
            this.accountModel.bulkWrite(accountDocs.map(({ gaijinId, ...other }) => ({
                updateOne: { filter: { gaijinId }, update: { $set: other } },
            }))),
            this.pointLogModel.insertMany(pointDocs)
        ])
            .then(() => Ok(models.map(it => it.id)));

        return new AsyncResult(promise);
    }

    restoreFromBackup(year: number, seasonIndex: number): AsyncActionResult<Member[]> {
        const timeBound = new Date(year, seasonIndex * 2)

        const pointLogPromise = this.pointLogModel
            .aggregate<{ _id: string, logs: PointLogSchema[] }>()
            .match({ date: { $lt: timeBound } })
            .group({ _id: "$memberId", logs: { $push: "$$ROOT" } })
            .then(pointLogGroup => mapValues(keyBy(pointLogGroup, it => it._id), it => it.logs))

        const backupPromise = this.backupModel.findOne({ year, seasonIndex }).lean()

        const promise = Promise.all([backupPromise, pointLogPromise])
            .then(([backup, pointLogIndex]) => {
                if (backup === null) throw Error(`無法找到 ${year} 年第 ${seasonIndex} 賽季的歷史資料`)
                const { accounts, members } = backup;
                if (accounts.some(account => account.ownerId === null)) throw Error(`${year} 年第 ${seasonIndex} 賽季有帳號未設置擁有者`)

                const accountsGroupByOwner = groupBy(accounts, it => it.ownerId)

                return Ok(members.map(member => MemberMapper.fromMongo({
                    ...member,
                    isLeave: false,
                    pointLogs: pointLogIndex[member.discordId] ?? [],
                    accounts: accountsGroupByOwner[member.discordId] ?? []
                })))
            })

        return new AsyncResult(promise);
    }

    findMemberById(memberId: MemberId): AsyncActionResult<Member> {
        const promise = this.memberModel.findOne({ discordId: memberId.value })
            .populate("accounts")
            .populate("pointLogs")
            .lean()
            .then(doc => doc === null ? Err(MemberNotFoundError.create(memberId)) : Ok(MemberMapper.fromMongo(doc)));
        return new AsyncResult(promise);
    }

    findMemberByAccountId(accountId: AccountId): AsyncActionResult<Member> {
        const promise = this.accountModel.findOne({ gaijinId: accountId.value }, { ownerId: true })
            .lean()
            .then(accountDoc => {
                if (accountDoc === null) return Err(AccountNotFoundError.create(accountId))
                if (accountDoc.ownerId === null) return Err(AccountNoOwnerError.create(accountId))
                return this.findMemberById(new MemberId(accountDoc.ownerId)).promise
            })

        return new AsyncResult(promise);
    }

    dumpAccounts(): AsyncActionResult<Account[]> {
        const promise = this.accountModel.find()
            .lean()
            .then(accounts => accounts.map(account => Account.rebuild(new AccountId(account.gaijinId), {
                personalRating: account.personalRating,
                name: account.name,
                type: account.type,
            })))
            .then(accounts => Ok(accounts));
        return new AsyncResult(promise);
    }

    saveAccounts(accounts: Account[]): AsyncActionResult<SaveAccountsResult> {
        const updateOnes = accounts.map<AnyBulkWriteOperation<AccountSchema>>(it => ({
            updateOne: {
                filter: { gaijinId: it.id.value },
                update: { $set: omitBy({ name: it.name, joinDate: it.joinDate, activity: it.activity, personalRating: it.personalRating, active: true }, isUndefined) },
                upsert: true,
            },
        }));

        const promise = this.accountModel
            .bulkWrite([
                { deleteMany: { filter: { gaijinId: { $nin: accounts.map(it => it.id.value) } } } },
                ...updateOnes,
            ])
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

    findAccountById(accountId: AccountId): AsyncActionResult<FindAccountByIdResult> {
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
            });
        return new AsyncResult(promise);
    }

    backup(year: number, seasonIndex: number): AsyncActionResult<void> {
        const promise = Promise.all([this.accountModel.find().lean(), this.memberModel.find().lean()])
            .then(([accounts, members]) => {
                return this.backupModel.updateOne(
                    { year, seasonIndex },
                    {
                        $set: {
                            accounts: accounts,
                            members: members,
                        },
                    },
                    { upsert: true },
                );
            })
            .then(() => Ok.EMPTY);

        return new AsyncResult(promise);
    }
}

export const MongoMemberRepoProvider: Provider = { provide: MemberRepo, useClass: MongoMemberRepo };
