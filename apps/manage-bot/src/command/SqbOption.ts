import { BooleanOption, StringOption } from "necord";

export class SqbScheduleDisplayOption {
    @BooleanOption({ required: false, name: "原地發送", description: "是否發送於使用命令時的頻道，否則發送到聯隊戰公告，預設為是" })
    inplace!: boolean | null;

    @BooleanOption({ required: false, name: "通知", description: "是否通知聯隊戰推播身分組，預設為否" })
    notification!: boolean | null;

    @StringOption({
        required: false,
        name: "時間",
        description: "目前或最新的賽季，預設為目前",
        choices: [{ value: "current", name: "目前" }, { value: "latest", name: "最新" }],
    })
    type!: "current" | "latest" | null;
}


export namespace OptionNormalizer {
    export function SqbScheduleDisplay(options: SqbScheduleDisplayOption): SqbScheduleDisplayOption {
        if (options.notification === null) options.notification = false;
        if (options.inplace === null) options.inplace = true;
        if (options.type === null) options.type = "current";
        return options;
    }
}