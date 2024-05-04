import { ApiProperty } from "@nestjs/swagger";
import { AccountType } from "../../domain";

export class ListAccountDTO {
    @ApiProperty({ example: "47088358", description: "Gaijin 帳號 ID" })
    id!: string;

    @ApiProperty({ example: "HI_OuO", description: "遊戲內 ID" })
    name!: string;

    @ApiProperty({ example: "456451265474", nullable: true })
    ownerId!: string | null;

    @ApiProperty({ example: 1233, description: "聯隊戰個人評分" })
    personalRating!: number;

    @ApiProperty({ example: 3411, description: "活躍度" })
    activity!: number;

    @ApiProperty({ enum: AccountType, description: "帳號類型", nullable: true })
    type!: AccountType | null;

    @ApiProperty({ example: "2022-11-01", description: "日期格式 YYYY-MM-DD" })
    joinDate!: Date;
}