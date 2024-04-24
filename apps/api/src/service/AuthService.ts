import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { MemberQueryRepo } from "@t1fr/backend/member-manage";
import { AsyncResult, Ok } from "ts-results-es";
import { User } from "../types";

type DiscordTokenResponse = { access_token: string }
type DiscordIdentityResponse = { id: string }

@Injectable()
export class AuthService {
    @Inject()
    private readonly httpService!: HttpService;

    @MemberQueryRepo()
    private readonly memberRepo!: MemberQueryRepo;

    async login(referer: string, code: string | undefined): Promise<User> {
        if (!code) throw new UnauthorizedException("無效的授權");
        const userOrError = await this.getToken(code, referer)
            .andThen(token => this.getUserId(token))
            .andThen(id => this.queryMember(id))
            .promise;

        if (userOrError.isErr()) throw new InternalServerErrorException(userOrError.error);

        return userOrError.value;
    }

    private static DiscordTokenUrl = "https://discord.com/api/v10/oauth2/token";
    private static ClientId = "1013280626000003132";
    private static ClientSecret = "l6l-mpiqLQjhIbukQjiW7zitAq3Xxbme";
    private static RequestTokenConfig = {
        auth: { username: AuthService.ClientId, password: AuthService.ClientSecret },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    };

    private getToken(referer: string, code: string) {
        const redirect_uri = `${referer}/auth/redirect`;
        const data = { grant_type: "authorization_code", code, redirect_uri };
        const promise = this.httpService.axiosRef.post<DiscordTokenResponse>(
            AuthService.DiscordTokenUrl, data, AuthService.RequestTokenConfig,
        )
            .then(response => Ok(response.data.access_token))
            .catch(reason => {
                throw new InternalServerErrorException(reason);
            });

        return new AsyncResult(promise);
    }

    private static DiscordIdentityUrl = "https://discord.com/api/users/@me";

    private getUserId(token: string) {
        const promise = this.httpService.axiosRef.get<DiscordIdentityResponse>(AuthService.DiscordIdentityUrl, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => Ok(response.data.id))
            .catch(reason => {
                throw new InternalServerErrorException(reason);
            });
        return new AsyncResult(promise);
    }

    private queryMember(id: string) {
        const promise = this.memberRepo.findExistMemberInfo(id)
            .then(info => {
                if (info === null) throw new UnauthorizedException(`無法尋找到您的隊員紀錄`);
                return Ok(new User(info));
            });
        return new AsyncResult(promise);
    }
}
