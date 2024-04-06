import { MemberInfo } from "@app/squadron-manage-backend/modules/management/member/member.schema";

declare global {
	namespace Express {
		export interface Request {
			user: MemberInfo;
		}
	}
}