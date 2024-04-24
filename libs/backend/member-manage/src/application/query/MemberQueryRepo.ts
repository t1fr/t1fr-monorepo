import { Inject } from "@nestjs/common";
import { ListAccountDTO } from "./ListAccountDTO";
import { ListExistMemberDTO } from "./ListExistMemberDTO";
import { MemberInfo } from "./MemberInfo";

export const MemberQueryRepo = () => Inject(MemberQueryRepo);

export type SearchAccountByNameDTO = { id: string, name: string };

export interface MemberQueryRepo {
    searchAccountByName(name: string): Promise<SearchAccountByNameDTO[]>;

    findExistMemberInfo(memberId: string): Promise<MemberInfo | null>;

    listAccounts(): Promise<ListAccountDTO[]>;

    listExistMember(): Promise<ListExistMemberDTO[]>;
}