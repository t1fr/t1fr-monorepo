import { PointEvent, PointType, PointTypes, RewardPointCategories, RewardPointCategory } from "@t1fr/legacy/management";
import { BooleanOption, NumberOption, StringOption } from "necord";
import { arrayToChoices } from "../utlity";

export class AwardData implements Omit<PointEvent, "type" | "date"> {
    @StringOption({ name: "member", description: "擁有者 DC 帳號", required: true, autocomplete: true })
    member!: string;

    @NumberOption({ name: "delta", description: "變化量", required: true })
    delta!: number;

    @StringOption({
        name: "category",
        description: "分類",
        required: true,
        choices: arrayToChoices(RewardPointCategories),
    })
    category!: RewardPointCategory;

    @StringOption({ name: "reason", description: "原因" })
    comment!: string;
}

export class MemberInfoOption {
    @StringOption({ name: "member", description: "成員", required: true, autocomplete: true })
    member!: string;
}

export class SeasonSummary {
    @StringOption({ name: "type", description: "積分類型", choices: arrayToChoices(PointTypes), required: true })
    type!: PointType;

    @BooleanOption({ name: "write", description: "結果是否寫入資料庫" })
    writeInToDb!: boolean | null;
}
