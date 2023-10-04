import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Member {
	@Prop()
	_id: string;

	@Prop({ index: true })
	nickname: string;

	@Prop({ default: true, select: false })
	isExist?: boolean;

	@Prop({ default: false })
	isOfficer?: boolean;

	@Prop()
	avatarHash?: string;
}

export const MemberModelDef: ModelDefinition = { name: Member.name, schema: SchemaFactory.createForClass(Member) };
