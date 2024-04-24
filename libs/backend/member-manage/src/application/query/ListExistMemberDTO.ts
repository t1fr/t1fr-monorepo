import { ApiProperty } from "@nestjs/swagger";

export class ListExistMemberDTO {
    @ApiProperty({ name: "DC 頭像連結" })
    avatarUrl!: string;

    @ApiProperty({ name: "DC ID" })
    id!: string;

    @ApiProperty({ name: "是否為軍官" })
    isOfficer!: boolean;

    @ApiProperty({ name: "是否為贊助者" })
    isSponsor!: boolean;

    @ApiProperty({ name: "DC 暱稱" })
    name!: string;

    @ApiProperty({ name: "目前是否沒有帳號" })
    noAccount!: boolean;

    @ApiProperty({ name: "請假中" })
    onVacation!: boolean;

    @ApiProperty({ name: "隊員類型" })
    type!: string;
}