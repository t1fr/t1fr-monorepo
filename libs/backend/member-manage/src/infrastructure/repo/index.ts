import { MongoMemberRepoProvider } from "./MongoMemberRepo";
import { WebscraperAccountDatasourceProvider } from "./WebscraperAccountDatasouce";

export const MemberManageInfraProvider = [
    WebscraperAccountDatasourceProvider,
    MongoMemberRepoProvider,
];