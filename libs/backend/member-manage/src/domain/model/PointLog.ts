import { ValueObject } from "@t1fr/backend/ddd-types";
import { Ok } from "ts-results-es";
import type { PointType } from "./PointType";

export type PointLogProps = {
    delta: number;
    type: PointType;
    comment?: string | null;
    category: string;
}


export class PointLog extends ValueObject<PointLogProps> {
    static create(props: PointLogProps) {
        if (!props.comment) props.comment = null;
        return Ok(new PointLog(props));
    }
}

export type PointSummary = Record<PointType, number> & { isInitAbsense: boolean }
