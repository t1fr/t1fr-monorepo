import { Member } from "@/modules/management/member/member.schema";

declare global {
	namespace Express {
		export interface Request {
			user: Omit<Member, "isExist">;
		}
	}
}