import { AssignAccountOwnerHandler } from "./AssignAccountOwnerHandler";
import { BackupHandler } from "./BackupHandler";
import { SetAccountTypeHandler } from "./SetAccountTypeHandler";
import { SyncMemberHandler } from "./SyncMemberHandler";

export * from "./AssignAccountOwner";
export * from "./Backup";
export * from "./DisbandMember";
export * from "./JoinMember";
export * from "./SetAccountType";
export * from "./SyncMember";
export * from "./UpdateMemberInfo";
export * from "./UpdateMemberType";

export const MemberManageCommandHandler = [
    SyncMemberHandler,
    AssignAccountOwnerHandler,
    BackupHandler,
    SetAccountTypeHandler
];