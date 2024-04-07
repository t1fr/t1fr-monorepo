import * as process from "process";

export enum ConnectionName {
	Management = "management",
	Common = "common",
}

export const Channel = {
	入隊須知: "1145362065813405776",
	入隊申請窗口: process.env.NODE_ENV === "production" ? "1046829250101117038" : "1104331400993312828",
	聯隊戰公告: "1046644902630522900",
};
