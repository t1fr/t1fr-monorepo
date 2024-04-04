import { Model } from "mongoose";
import { AccountSnapshot } from "../account.snapshot.schema";
import { BaseResultData } from "./result.data";
import { Summary } from "../summary.schema";

export interface PointSubservice {
	calculate(snapshotModel: Model<AccountSnapshot>, summaries: Summary[]): Promise<BaseResultData[]>;

	toPost(data: BaseResultData[]): string[];
}