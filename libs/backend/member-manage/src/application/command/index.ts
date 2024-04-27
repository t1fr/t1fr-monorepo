import { AssignAccountOwnerHandler } from "./AssignAccountOwnerHandler";
import { BackupHandler } from "./BackupHandler";
import { ScrapeAccountHandler } from "./ScrapeAccountHandler";
import { SyncMemberHandler } from "./SyncMemberHandler";

export * from "./ScrapeAccount";
export * from "./SyncMember";
export * from "./JoinMember";
export * from "./DisbandMember";
export * from "./UpdateMemberInfo";
export * from "./UpdateMemberType";
export * from "./AssignAccountOwner";
export * from "./SetAccountType";
export * from "./Backup";

export const MemberManageCommandHandler = [
    ScrapeAccountHandler,
    SyncMemberHandler,
    AssignAccountOwnerHandler,
    BackupHandler,
];