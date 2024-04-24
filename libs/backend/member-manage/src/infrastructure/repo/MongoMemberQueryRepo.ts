import { Provider } from "@nestjs/common";
import { FilterQuery, ProjectionType } from "mongoose";
import { ListAccountDTO, ListExistMemberDTO, MemberInfo, MemberQueryRepo, SearchAccountByNameDTO } from "../../application";
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
}

export const MongoMemberQueryRepoProvider: Provider = { provide: MemberQueryRepo, useClass: MongoMemberQueryRepo };