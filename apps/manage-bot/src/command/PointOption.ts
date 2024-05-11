import { PointType } from "@t1fr/backend/member-manage";
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

export class SeasonSummaryOption {
    @StringOption({ name: "type", description: "積分類型", required: true, choices: [{ value: PointType.Reward, name: "獎勵" }] })
    type!: string;

    @NumberOption({ name: "year", description: "年份", required: true })
    year!: number;

    @NumberOption({ name: "season", description: "年份", required: true, choices: [1, 2, 3, 4, 5, 6].map(it => ({ value: it, name: `${it}` })) })
    seasonIndex!: number;

    @BooleanOption({ name: "write", description: "結果是否寫入資料庫，預設為否" })
    write!: boolean | null;
}
