import { ICommand } from "@nestjs/cqrs";

export abstract class Command<T = unknown> implements ICommand {
	readonly data: Readonly<T>;

	constructor(data: T) {
		this.data = Object.freeze(data);
	}
}



