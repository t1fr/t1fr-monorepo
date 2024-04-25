import { isEqual } from "lodash";

interface LiteralObject {
    [index: string]: unknown;
}

function shallowObjectEqual(lhs: LiteralObject, rhs: LiteralObject) {
    const lhsKeys = Object.entries(rhs).filter(([key, value]) => value !== undefined).map(([key]) => key);
    const rhsKeys = Object.entries(lhs).filter(([key, value]) => value !== undefined).map(([key]) => key);
    if (lhsKeys.length !== rhsKeys.length) return false;
    return lhsKeys.every(key => {
        if (!Object.prototype.hasOwnProperty.call(rhs, key)) return false;
        const rhsValue = rhs[key];
        const lhsValue = lhs[key];
        if (rhsValue instanceof ValueObject && lhsValue instanceof ValueObject) return rhsValue.equals(lhsValue);
        return isEqual(rhsValue, lhsValue);
    });
}

export abstract class ValueObject<Props extends object> {
    readonly props: Readonly<Props>;

    protected constructor(props: Props) {
        this.props = Object.freeze(props);
    }

    equals(obj?: ValueObject<Props>): boolean {
        if (obj === null || obj === undefined) return false;
        if (obj.props === undefined) return false;
        return shallowObjectEqual(this.props, obj.props);
    }
}