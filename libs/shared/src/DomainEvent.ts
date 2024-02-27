import { IEvent } from "@nestjs/cqrs";

export abstract class DomainEvent implements IEvent {
	readonly occuredOn: Date = new Date();
}