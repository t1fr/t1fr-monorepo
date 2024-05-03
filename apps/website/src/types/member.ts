export class Member {
    readonly callsign: string;
    readonly gameId: string;
    constructor(
        readonly id: string,
        readonly nickname: string,
        readonly isOfficer: boolean,
        readonly noAccount: boolean,
        readonly avatarUrl: string,
    ) {
        const match = this.nickname.match(/.*丨(?<callsign>.*)丨(?<id>.*)/);
        this.callsign = match?.groups?.callsign ?? this.nickname;
        this.gameId = match?.groups?.id ?? nickname;
    }
}

