import { BooleanOption, NumberOption, StringOption } from "necord";

export class AwardData {
    @StringOption({ name: "member", description: "擁有者 DC 帳號", required: true, autocomplete: true })
    member!: string;

    @NumberOption({ name: "delta", description: "變化量", required: true })
    delta!: number;

    @StringOption({
        name: "category",
        description: "分類",
        required: true,
    })
    category!: string;

    @StringOption({ name: "reason", description: "原因" })
    comment!: string;
}

export class MemberInfoOption {
    @StringOption({ name: "member", description: "成員", required: true, autocomplete: true })
    member!: string;
}

export class SeasonSummary {
    @StringOption({ name: "type", description: "積分類型", required: true })
    type!: string;

    @BooleanOption({ name: "write", description: "結果是否寫入資料庫" })
    writeInToDb!: boolean | null;
}
