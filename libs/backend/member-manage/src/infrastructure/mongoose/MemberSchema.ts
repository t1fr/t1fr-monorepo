import { InjectModel, ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MemberType } from "../../domain";
import type { AccountSchema } from "./AccountSchema";
import { AccountSchemaRefToken, MemberManageMongooseConnection, MemberSchemaRefToken } from "./connection";

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
    isSponsor!: boolean;

    @Prop({ default: false })
    onVacation!: boolean;

    @Prop()
    avatarUrl!: string;

    @Prop({ type: String, enum: MemberType })
    type!: MemberType;

    accounts!: AccountSchema[];

    accountCount?: number;
}

const memberSchema = SchemaFactory.createForClass(MemberSchema);

memberSchema.virtual("accounts", { ref: AccountSchemaRefToken, localField: "discordId", foreignField: "ownerId" });
memberSchema.virtual("accountCount", { ref: AccountSchemaRefToken, localField: "discordId", foreignField: "ownerId", count: true });

export const MemberModelDef: ModelDefinition = { name: MemberSchemaRefToken, schema: memberSchema };

export type MemberModel = Model<MemberSchema>

export const InjectMemberModel = () => InjectModel(MemberSchemaRefToken, MemberManageMongooseConnection);