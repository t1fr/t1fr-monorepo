import { ScrapeAccountHandler } from "./ScrapeAccountHandler";
import { SyncMemberHandler } from "./SyncMemberHandler";

export * from "./ScrapeAccount";
export * from "./SyncMember";
export * from "./JoinMember";
export * from "./DisbandMember";
export * from "./UpdateMemberInfo";
export * from "./UpdateMemberType";

export const MemberManageCommandHandler = [
    ScrapeAccountHandler,
    SyncMemberHandler,
];