import { InjectModel, type ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AccountType } from "../../domain";
import { AccountSchemaRefToken, MemberManageMongooseConnection, MemberSchemaRefToken } from "./connection";
import type { MemberSchema } from "./MemberSchema";

@Schema({ collection: "accounts", versionKey: false, timestamps: { updatedAt: true, createdAt: false } })
export class AccountSchema {
    @Prop({ index: true, unique: true })
    gaijinId!: string;

    @Prop({ index: true, unique: true })
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

export const InjectAccountModel = () => InjectModel(AccountSchemaRefToken, MemberManageMongooseConnection);