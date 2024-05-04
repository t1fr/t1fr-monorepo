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

        const match = this.name.match(/.*丨(?<callsign>.*)丨(?<id>.*)/);
        this.callsign = match?.groups?.callsign ?? this.name;
        this.gameId = match?.groups?.id ?? this.name;
    }
}

export class Member extends MemberInfo {
    private cachedTypeLabel?: string;
    private cachedType?: MemberType;


    readonly type: MemberType;
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
    }

    get typeLabel() {
        if (this.cachedType !== this.type) {
            this.cachedTypeLabel = this.type === "relaxer" ? "休閒隊員" : "聯隊戰隊員";
            this.cachedType = this.type;
            return this.cachedTypeLabel;
        } else {
            if (this.cachedTypeLabel === undefined) this.cachedTypeLabel = this.type === "relaxer" ? "休閒隊員" : "聯隊戰隊員";
            return this.cachedTypeLabel;
        }
    }
}

