import { MemberInfo } from '@/modules/management/member/member.schema'

declare global {
	namespace Express {
		export interface Request {
			user: MemberInfo;
		}
	}
}