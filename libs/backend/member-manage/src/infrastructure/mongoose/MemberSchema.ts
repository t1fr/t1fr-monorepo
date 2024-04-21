import { InjectModel, ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MemberType } from "../../domain";
import type { AccountSchema } from "./AccountSchema";
import { AccountSchemaRefToken, MEMBER_MANAGE_MONGOOSE_CONNECTION_TOKEN, MemberSchemaRefToken } from "./connection";

@Schema({ collection: "members", versionKey: false, timestamps: true })
export class MemberSchema {
    @Prop({ index: true, unique: true })
    discordId!: string;

    @Prop({ index: true })
    nickname!: string;

    @Prop({ default: false })
    isLeave!: boolean;

    @Prop({ default: false })
    isOfficer!: boolean;

    @Prop({ default: false })
    onVacation!: boolean;

    @Prop()
    avatarUrl!: string;

    @Prop({ type: String, enum: MemberType })
    type!: MemberType;

    accounts!: AccountSchema[];
}

const memberSchema = SchemaFactory.createForClass(MemberSchema);

memberSchema.virtual("accounts", { ref: AccountSchemaRefToken, localField: "discordId", foreignField: "ownerId" });

export const MemberModelDef: ModelDefinition = { name: MemberSchemaRefToken, schema: memberSchema };

export type MemberModel = Model<MemberSchema>

export const InjectMemberModel = () => InjectModel(MemberSchemaRefToken, MEMBER_MANAGE_MONGOOSE_CONNECTION_TOKEN);