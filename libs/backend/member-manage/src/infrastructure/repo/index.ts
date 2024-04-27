import { MongoMemberQueryRepoProvider } from "./MongoMemberQueryRepo";
import { MongoMemberRepoProvider } from "./MongoMemberRepo";

export const MemberManageInfraProvider = [
    MongoMemberRepoProvider,
    MongoMemberQueryRepoProvider,
];

export { MongoMemberQueryRepoProvider };
