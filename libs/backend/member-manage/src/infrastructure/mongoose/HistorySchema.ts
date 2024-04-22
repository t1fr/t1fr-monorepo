import { InjectModel, ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AccountType, MemberType } from "../../domain";
import { Model } from "mongoose";
import { AccountSchema } from "./AccountSchema";
import { MEMBER_MANAGE_MONGOOSE_CONNECTION_TOKEN } from "./connection";
import { MemberSchema } from "./MemberSchema";

class AccountData implements Pick<AccountSchema, "type" | "personalRating" | "name" | "activity" | "joinDate" | "ownerId"> {
    type!: AccountType | null;
    personalRating!: number;
    name!: string;
    activity!: number;
    joinDate!: Date;
    ownerId!: string | null;
}

class MemberData implements Pick<MemberSchema, "type" | "discordId" | "onVacation" | "isSponsor"> {
    type!: MemberType;
    discordId!: string;
    onVacation!: boolean;
    isSponsor!: boolean;
}

@Schema({ collection: "history" })
export class HistorySchema {
    @Prop()
    year!: number;

    @Prop()
    season!: number;

    @Prop({ type: AccountData })
    accounts!: AccountData[];

    @Prop({ type: MemberData })
    members!: MemberData[];
}

export const historyModelDef: ModelDefinition = { name: HistorySchema.name, schema: SchemaFactory.createForClass(HistorySchema) };

export type HistoryModel = Model<HistorySchema>

export const InjectHistoryModel = () => InjectModel(HistorySchema.name, MEMBER_MANAGE_MONGOOSE_CONNECTION_TOKEN);