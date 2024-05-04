import { Inject } from "@nestjs/common";
import { AsyncActionResult } from "@t1fr/backend/ddd-types";
import { PointType } from "../../domain";
import { GetPointLogDTO } from "./GetPointLogDTO";
import { ListAccountDTO } from "./ListAccountDTO";
import { ListExistMemberDTO } from "./ListExistMemberDTO";
import { MemberDetail } from "./MemberDetail";
import { MemberInfo } from "./MemberInfo";
import { PageControl } from "./PageControl";

export const MemberQueryRepo = () => Inject(MemberQueryRepo);

export type SearchAccountByNameDTO = { id: string, name: string };

export interface MemberQueryRepo {
    searchAccountByName(name: string): Promise<SearchAccountByNameDTO[]>;

    findExistMemberInfo(memberId: string): Promise<MemberInfo | null>;

    listAccounts(): Promise<ListAccountDTO[]>;

    listExistMember(): Promise<ListExistMemberDTO[]>;

    getMemberDetail(memberId: string): AsyncActionResult<MemberDetail>;

    getPointLogs(type: PointType, control: PageControl, memberId: string | undefined): Promise<GetPointLogDTO>
}