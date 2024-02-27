import { ICommand } from "@nestjs/cqrs";

export class ParseSchedule implements ICommand {

	constructor(readonly year: number, readonly text: string) {
	}
}