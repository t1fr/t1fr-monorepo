import { BooleanOption } from "necord";

export class SqbScheduleDisplayOption {
    @BooleanOption({ required: false, name: "原地發送", description: "是否發送於使用命令時的頻道，若否或留空則發佈到聯隊戰公告" })
    inplace!: boolean | null;

    @BooleanOption({ required: false, name: "通知", description: "是否通知聯隊戰推播身分組，預設為否" })
    notification!: boolean | null;
}