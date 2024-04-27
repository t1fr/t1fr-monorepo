import { InjectModel, ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AccountType, MemberType } from "../../domain";
import { AccountSchema } from "./AccountSchema";
import { MemberManageMongooseConnection } from "./connection";
import { MemberSchema } from "./MemberSchema";

@Schema({ _id: false })
class AccountData implements Pick<AccountSchema, "type" | "personalRating" | "name" | "activity" | "joinDate" | "ownerId" | "gaijinId"> {
    @Prop()
    gaijinId!: string;

    @Prop({ type: String })
    type!: AccountType | null;

    @Prop()
    personalRating!: number;

    @Prop()
    name!: string;

    @Prop()
    activity!: number;

    @Prop()
    joinDate!: Date;

    @Prop({ type: String })
    ownerId!: string | null;
}

@Schema({ _id: false })
class MemberData implements Pick<MemberSchema, "type" | "discordId" | "onVacation" | "isSponsor"> {
    @Prop({ type: String })
    type!: MemberType;

    @Prop()
    discordId!: string;

    @Prop()
    onVacation!: boolean;

    @Prop()
    isSponsor!: boolean;
}

@Schema({ collection: "backups", versionKey: false })
export class BackupSchema {
    @Prop()
    year!: number;

    @Prop()
    seasonIndex!: number;

    @Prop({ type: [AccountData] })
    accounts!: AccountData[];

    @Prop({ type: [MemberData] })
    members!: MemberData[];
}

export const BackupModelDef: ModelDefinition = { name: BackupSchema.name, schema: SchemaFactory.createForClass(BackupSchema) };

export type BackupModel = Model<BackupSchema>

export const InjectBackupModel = () => InjectModel(BackupSchema.name, MemberManageMongooseConnection);