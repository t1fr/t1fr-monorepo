export enum ConnectionName {
  Management = "management",
  Common = "common",
}

export const SquadronMemberListUrl = "https://warthunder.com/en/community/claninfo/The%20First%20Frontline%20Rangers";


export const DiscordRole = {
  軍官: "1046629416240955414",
  聯隊戰隊員: "1046629026355228762",
  聯隊戰身分群: "1054766361991204864",
  休閒隊員: "1103384315599015987",
  get 隊員身分() {
    return [this.聯隊戰隊員, this.休閒隊員];
  },
  推播: {
    聯隊戰: "1145364425658867754",
    聯隊公告: "1145364543149715486",
    聯隊活動: "1145364635726397581",
    公民表決: "1145885131719069756",
  },
};
