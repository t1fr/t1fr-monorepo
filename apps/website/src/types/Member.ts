import type { MemberType } from "@t1fr/backend/member-manage";

type MemberInfoRebuildProps = {
    id: string,
    name: string,
    avatarUrl: string,
    isOfficer: boolean,
}

type MemberRebuildProps = {
    type: MemberType,
    isSponsor: boolean,
    noAccount: boolean,
    onVacation: boolean,
} & MemberInfoRebuildProps;

export class MemberInfo {

    readonly id: string;

    readonly name: string;
    readonly callsign: string;
    readonly gameId: string;

    readonly avatarUrl: string;

    readonly isOfficer: boolean;

    constructor(props: MemberInfoRebuildProps) {
        ({
            id: this.id,
            name: this.name,
            avatarUrl: this.avatarUrl,
            isOfficer: this.isOfficer,
        } = props);

        const match = this.name.match(/^[^丨]*丨((?<callsign>.*)丨)?(?<id>.*)/);
        this.gameId = match?.groups?.id ?? this.name;
        this.callsign = match?.groups?.callsign ?? this.gameId;
    }
}

export class Member extends MemberInfo {
    readonly type: MemberType;
    readonly typeLabel: string;
    readonly isSponsor: boolean;
    readonly noAccount: boolean;
    readonly onVacation: boolean;
    constructor(props: MemberRebuildProps) {
        const { id, isOfficer, avatarUrl, name, ...other } = props;
        super({ id, isOfficer, avatarUrl, name });
        ({
            type: this.type,
            isSponsor: this.isSponsor,
            noAccount: this.noAccount,
            onVacation: this.onVacation
        } = other);

        this.typeLabel = this.type === "relaxer" ? "休閒隊員" : "聯隊戰隊員";
    }
}

