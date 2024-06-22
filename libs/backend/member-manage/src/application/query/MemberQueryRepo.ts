import { Inject } from "@nestjs/common";
import type { AsyncActionResult } from "@t1fr/backend/ddd-types";
import { PointType } from "../../domain";
import type { GetPointLogDTO } from "./GetPointLogDTO";
import { ListAccountDTO } from "./ListAccountDTO";
import { ListExistMemberDTO } from "./ListExistMemberDTO";
import type { MemberDetail } from "./MemberDetail";
import type { MemberInfo } from "./MemberInfo";
import type { PageControl } from "./PageControl";
import type { SearchAccountByNameDTO } from "./SearchAccountByNameDTO";

export const MemberQueryRepo = () => Inject(MemberQueryRepo);

export interface MemberQueryRepo {
    searchAccountByName(name: string): Promise<SearchAccountByNameDTO[]>;

    findExistMemberInfo(memberId: string): Promise<MemberInfo | null>;

    listAccounts(): Promise<ListAccountDTO[]>;

    listExistMember(): Promise<ListExistMemberDTO[]>;

    getMemberDetail(memberId: string): AsyncActionResult<MemberDetail>;

    getPointLogs(type: PointType, control: PageControl, memberId: string | undefined): Promise<GetPointLogDTO>
}