import { Provider } from "@nestjs/common";
import { AsyncActionResult } from "@t1fr/backend/ddd-types";
import { FilterQuery, ProjectionType } from "mongoose";
import { AsyncResult, Err, Ok } from "ts-results-es";
import { ListAccountDTO, ListExistMemberDTO, MemberDetail, MemberInfo, MemberQueryRepo, SearchAccountByNameDTO } from "../../application";
import { MemberNotFoundError } from "../../domain";
import { AccountModel, AccountSchema, InjectAccountModel, InjectMemberModel, MemberModel } from "../mongoose";

class MongoMemberQueryRepo implements MemberQueryRepo {

    @InjectAccountModel()
    private readonly accountModel!: AccountModel;

    @InjectMemberModel()
    private readonly memberModel!: MemberModel;

    async searchAccountByName(name: string): Promise<SearchAccountByNameDTO[]> {
        const filter: FilterQuery<AccountSchema> = name.length ? { name: { $regex: RegExp(name, "i") } } : {};
        const projection: ProjectionType<AccountSchema> = { name: true, gaijinId: true };

        const docs = await this.accountModel
            .find(filter, projection)
            .lean();

        return docs.map(it => ({ id: it.gaijinId, name: it.name }));
    }

    async findExistMemberInfo(memberId: string): Promise<MemberInfo | null> {
        const doc = await this.memberModel
            .findOne({ discordId: memberId }, { avatarUrl: true, isOfficer: true, discordId: true, nickname: true })
            .lean();

        return doc ? { id: doc.discordId, name: doc.nickname, avatarUrl: doc.avatarUrl, isOfficer: doc.isOfficer } : null;
    }

    async listAccounts(): Promise<ListAccountDTO[]> {
        const docs = await this.accountModel.find().lean();
        return docs.map(doc => ({
            id: doc.gaijinId,
            type: doc.type,
            name: doc.name,
            ownerId: doc.ownerId,
            personalRating: doc.personalRating,
            activity: doc.activity,
            joinDate: doc.joinDate,
        }));
    }

    async listExistMember(): Promise<ListExistMemberDTO[]> {
        const docs = await this.memberModel.find({ isLeave: false })
            .populate("accountCount")
            .lean();

        return docs.map(({ isOfficer, isSponsor, discordId, avatarUrl, type, accountCount, nickname, onVacation }) => ({
            isOfficer,
            isSponsor,
            id: discordId,
            avatarUrl,
            type,
            noAccount: accountCount === 0,
            name: nickname,
            onVacation,
        }));
    }

    getMemberDetail(memberId: string): AsyncActionResult<MemberDetail> {
        const promise = this.memberModel.findOne({ discordId: memberId })
            .populate("accounts")
            .populate("pointLogs")
            .lean()
            .then(doc => {
                if (doc === null) return Err(MemberNotFoundError.create(memberId));
                const { accounts, pointLogs } = doc;

                const point: MemberDetail["point"] = {
                    "absense": { total: 0, logs: [] },
                    "reward": { total: 0, logs: [] },
                    "penalty": { total: 0, logs: [] },
                };

                pointLogs.forEach(log => {
                    const delta = parseFloat(log.delta.toString());
                    point[log.type].total += delta;
                    point[log.type].logs.push({
                        date: log.date,
                        delta: delta,
                        comment: log.comment,
                        category: log.category,
                    });
                });

                return Ok({
                    accounts: accounts.map(account => {
                        const { gaijinId: id, name, personalRating, activity, type, joinDate } = account;
                        return { id, name, personalRating, activity, type, joinDate };
                    }),
                    point,
                });
            });

        return new AsyncResult(promise);
    }
}

export const MongoMemberQueryRepoProvider: Provider = { provide: MemberQueryRepo, useClass: MongoMemberQueryRepo };