import { ValueObject } from "@app/shared/ValueObject";
import dayjs from "dayjs";

interface SectionProps {
	from: Date;
	to: Date;
	battleRating: number;
}

export class Section extends ValueObject<SectionProps> {
	constructor(props: { from: string | Date, to: string | Date, battleRating: number }) {
		const from = dayjs(props.from);
		const to = dayjs(props.to);
		if (from.isAfter(to)) throw Error(`from: ${from.toDate()} 不可晚於 to: ${to.toDate()}`);
		if (props.battleRating < 1.0) throw Error(`BR ${props.battleRating} 不可小於 1.0`);
		super({ from: from.toDate(), to: to.toDate(), battleRating: props.battleRating });
	}

	setFrom(date: Date | string) {
		return new Section({ ...this.props, from: date });
	}

	setTo(date: Date | string) {
		return new Section({ ...this.props, to: date });
	}

	setBattleRating(battleRating: number) {
		return new Section({ ...this.props, battleRating });
	}
}

