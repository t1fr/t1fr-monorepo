import { HttpService } from "@nestjs/axios";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MemberService } from "@t1fr/legacy/management";
import { Snowflake } from "discord.js";
import { lastValueFrom } from "rxjs";

@Injectable()
export class AuthService {
	constructor(
		private readonly memberService: MemberService,
		private readonly httpService: HttpService,
		private readonly jwtService: JwtService,
	) {}

	async login(isLocalhost: boolean, code?: string) {
		if (!code) throw new UnauthorizedException("無效的授權");
		const token = await this.getToken(code, isLocalhost);
		if (!token) throw new UnauthorizedException("無效的授權");
		const id = await this.getUserId(token);
		const member = await this.memberService.findMemberById(id);
		if (!member) throw new UnauthorizedException("非聯隊成員");
		return this.jwtService.sign(member.toObject());
	}

	private async getToken(code: string, isLocalhost: boolean) {
		const redirect_uri = isLocalhost ? "http://localhost:6518/api/auth/redirect" : "https://t1fr.club/api/auth/redirect";
		const data = { grant_type: "authorization_code", code, redirect_uri };
		try {
			const response = await this.httpService.axiosRef.post<{ access_token?: string }>("https://discord.com/api/v10/oauth2/token", data, {
				auth: { username: "1013280626000003132", password: "l6l-mpiqLQjhIbukQjiW7zitAq3Xxbme" },
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
			});
			return response.data.access_token;
		} catch (e) {
			console.error(e);
		}
	}

	private async getUserId(token: string) {
		const observable = this.httpService.get<{ id: Snowflake }>("https://discord.com/api/users/@me", { headers: { Authorization: `Bearer ${token}` } });
		const response = await lastValueFrom(observable);
		return response.data.id;
	}
}
