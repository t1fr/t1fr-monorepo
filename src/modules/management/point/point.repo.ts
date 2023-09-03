import { Injectable } from "@nestjs/common";
import { PointEvent, PointType } from "@/modules/management/point/point.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { isArray } from "lodash";

@Injectable()
export class PointRepo {
	constructor(@InjectModel(PointEvent.name) private readonly pointModel: Model<PointEvent>) {}

	async append(type: PointType, data: Omit<PointEvent, "type"> | Omit<PointEvent, "type">[]) {
		if (isArray(data)) {
			await this.pointModel.insertMany(data.map((value) => ({ type, ...value })));
		} else {
			await this.pointModel.insertMany({ type, ...data });
		}
	}
}
