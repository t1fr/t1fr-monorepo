import { InjectModel, ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AccountType } from "../../domain";
import { AccountSchemaRefToken, MEMBER_MANAGE_MONGOOSE_CONNECTION_TOKEN, MemberSchemaRefToken } from "./connection";
import type { MemberSchema } from "./MemberSchema";

@Schema({ collection: "accounts", versionKey: false, timestamps: { updatedAt: true, createdAt: false } })
export class AccountSchema {
    @Prop({ index: true, unique: true })
    gaijinId!: string;

    @Prop({ index: true })
    name!: string;

    @Prop({ type: String })
    ownerId!: string | null;

    @Prop({ type: String, enum: AccountType })
    type!: AccountType | null;

    @Prop()
    personalRating!: number;

    @Prop()
    activity!: number;

    @Prop()
    joinDate!: Date;

    owner?: MemberSchema;
}

const accountSchema = SchemaFactory.createForClass(AccountSchema);

accountSchema.virtual("owner", { ref: MemberSchemaRefToken, localField: "ownerId", foreignField: "discordId", justOne: true });

export const AccountModelDef: ModelDefinition = { name: AccountSchemaRefToken, schema: accountSchema };

export type AccountModel = Model<AccountSchema>

export const InjectAccountModel = () => InjectModel(AccountSchemaRefToken, MEMBER_MANAGE_MONGOOSE_CONNECTION_TOKEN);