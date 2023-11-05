import { Summary } from "@/modules/management/point/summary.schema";
import { BaseResultData } from "@/modules/management/point/subservice/result.data";
import { Model } from "mongoose";
import { AccountSnapshot } from "@/modules/management/point/account.snapshot.schema";

export interface PointSubservice {
	calculate(snapshotModel: Model<AccountSnapshot>, summaries: Summary[]): Promise<BaseResultData[]>;

	toPost(data: BaseResultData[]): string[];
}