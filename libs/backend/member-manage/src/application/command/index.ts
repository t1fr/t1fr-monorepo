import { AssignAccountOwnerHandler } from "./AssignAccountOwnerHandler";
import { BackupHandler } from "./BackupHandler";
import { SyncMemberHandler } from "./SyncMemberHandler";

export * from "./SyncMember";
export * from "./JoinMember";
export * from "./DisbandMember";
export * from "./UpdateMemberInfo";
export * from "./UpdateMemberType";
export * from "./AssignAccountOwner";
export * from "./SetAccountType";
export * from "./Backup";

export const MemberManageCommandHandler = [
    SyncMemberHandler,
    AssignAccountOwnerHandler,
    BackupHandler,
];