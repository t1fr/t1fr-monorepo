import { isEqual } from "lodash";

export abstract class ValueObject<Props extends object> {
	props: Readonly<Props>;

	constructor(props: Props) {
		this.props = Object.freeze(props);
	}

	equals(obj?: ValueObject<Props>): boolean {
		return isEqual(this.props, obj?.props);
	}
}