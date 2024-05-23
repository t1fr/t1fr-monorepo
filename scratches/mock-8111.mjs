import express from "express";
import cors from "cors";
const match1 = [
    { msg: "╔T1FR╕ Uruha_sky_cat (F-5E) 獲\t得\t嘉\t獎\t“地\t面\t部\t隊\t救\t星”", sender: "", enemy: false, mode: "", time: 168 },
    { msg: "╔T1FR╕ Uruha_sky_cat (F-5E) 獲\t得\t嘉\t獎\t“同\t仇\t敵\t愾”", sender: "", enemy: false, mode: "", time: 168 },
    { msg: "╔T1FR╕ neboci (T-80B) 獲\t得\t嘉\t獎\t“團\t隊\t協\t作\t×1”", sender: "", enemy: false, mode: "", time: 168 },
    { msg: "╔T1FR╕ 我是阳光开朗大男孩 (紳\t寶 J35XS) 擊\t毀\t了 ┺STOLR┻ TBo___cTPax (2S6)", sender: "", enemy: false, mode: "", time: 174 },
    { msg: "╔T1FR╕ ReApTiMe (90 式 (B)) 獲\t得\t嘉\t獎\t“團\t隊\t協\t作\t×2”", sender: "", enemy: false, mode: "", time: 174 },
    { msg: "╔T1FR╕ SSH74 (2S38) 獲\t得\t嘉\t獎\t“團\t隊\t協\t作\t×2”", sender: "", enemy: false, mode: "", time: 174 },
    { msg: "╔T1FR╕ neboci (T-80B) 獲\t得\t嘉\t獎\t“團\t隊\t協\t作\t×2”", sender: "", enemy: false, mode: "", time: 174 },
    { msg: "╔T1FR╕ SunnyEggTw (F-5E) 的\t攻\t擊\t重\t創\t了 ┺STOLR┻ Каракуля (A-6E (TRAM))", sender: "", enemy: false, mode: "", time: 191 },
    { msg: "┺STOLR┻ Каракуля (A-6E (TRAM)) 攻\t擊\t引\t燃 ╔T1FR╕ SunnyEggTw (F-5E)", sender: "", enemy: false, mode: "", time: 200 },
    { msg: "╔T1FR╕ ReApTiMe (90 式 (B)) 攻\t擊\t引\t燃 ┺STOLR┻ 121telepuzik (豹\t2A4)", sender: "", enemy: false, mode: "", time: 201 },
    { msg: "┺STOLR┻ Каракуля (A-6E (TRAM)) 擊\t落\t了 ╔T1FR╕ SunnyEggTw (F-5E)", sender: "", enemy: false, mode: "", time: 204 },
    { msg: "╔T1FR╕ ReApTiMe (90 式 (B)) 擊\t毀\t了 ┺STOLR┻ 121telepuzik (豹\t2A4)", sender: "", enemy: false, mode: "", time: 205 },
    { msg: "╔T1FR╕ 我是阳光开朗大男孩 (紳\t寶 J35XS) 獲\t得\t嘉\t獎\t“團\t隊\t協\t作\t×1”", sender: "", enemy: false, mode: "", time: 206 },
    { msg: "╔T1FR╕ SSH74 (2S38) 獲\t得\t嘉\t獎\t“團\t隊\t協\t作\t×3”", sender: "", enemy: false, mode: "", time: 206 },
    { msg: "╔T1FR╕ Uruha_sky_cat (F-5E) 獲\t得\t嘉\t獎\t“團\t隊\t協\t作\t×1”", sender: "", enemy: false, mode: "", time: 206 },
    { msg: "╔T1FR╕ frank111719 (Ka-50) 擊\t毀\t了 ┺STOLR┻ safari28062000 (Т\t-90\tА)", sender: "", enemy: false, mode: "", time: 215 },
    { msg: "╔T1FR╕ frank111719 (Ka-50) 擊\t毀\t了 ┺STOLR┻ GeorgeCap (T-80B)", sender: "", enemy: false, mode: "", time: 225 },
    { msg: "╔T1FR╕ frank111719 (Ka-50) 獲\t得\t嘉\t獎\t“連\t續\t無\t傷\t殲\t敵\t×3！”", sender: "", enemy: false, mode: "", time: 225 },
    { msg: "╔T1FR╕ frank111719 (Ka-50) 獲\t得\t嘉\t獎\t“雙\t殺！”", sender: "", enemy: false, mode: "", time: 225 },
    { msg: "┺STOLR┻ GeorgeCap 已\t斷\t線。", sender: "", enemy: false, mode: "", time: 229 },
    { msg: "GeorgeCaptd! kd?NET_PLAYER_DISCONNECT_FROM_GAME", sender: "", enemy: false, mode: "", time: 229 },
    { msg: "╔T1FR╕ frank111719 (Ka-50) 擊\t毀\t了 ┺STOLR┻ Nefiz_X (豹\t2A4 (第 123 裝\t甲\t營))", sender: "", enemy: false, mode: "", time: 253 },
    { msg: "╔T1FR╕ 我是阳光开朗大男孩 (紳\t寶 J35XS) 獲\t得\t嘉\t獎\t“火\t力\t支\t援\t×1！”", sender: "", enemy: false, mode: "", time: 254 },
    { msg: "╔T1FR╕ ReApTiMe (90 式 (B)) 獲\t得\t嘉\t獎\t“團\t隊\t協\t作\t×3”", sender: "", enemy: false, mode: "", time: 254 },
    { msg: "╔T1FR╕ frank111719 (Ka-50) 獲\t得\t嘉\t獎\t“連\t續\t無\t傷\t殲\t敵\t×4！”", sender: "", enemy: false, mode: "", time: 254 },
    { msg: "╔T1FR╕ frank111719 (Ka-50) 獲\t得\t嘉\t獎\t“三\t殺！”", sender: "", enemy: false, mode: "", time: 254 },
    { msg: "╔T1FR╕ neboci (T-80B) 獲\t得\t嘉\t獎\t“團\t隊\t協\t作\t×3”", sender: "", enemy: false, mode: "", time: 254 },
    { msg: "╔T1FR╕ SunnyEggTw (F-5E) 擊\t落\t了 ┺STOLR┻ Каракуля (A-6E (TRAM))", sender: "", enemy: false, mode: "", time: 263 },
    { msg: "╔T1FR╕ SunnyEggTw (F-5E) 獲\t得\t嘉\t獎\t“以\t眼\t還\t眼”", sender: "", enemy: false, mode: "", time: 263 },
    { msg: "┺STOLR┻ TBo___cTPax 已\t斷\t線。", sender: "", enemy: false, mode: "", time: 265 },
    { msg: "TBo___cTPaxtd! kd?NET_PLAYER_DISCONNECT_FROM_GAME", sender: "", enemy: false, mode: "", time: 265 },
    { msg: "╔T1FR╕ SSH74 (2S38) 的\t攻\t擊\t重\t創\t了 ╔T1FR╕ frank111719 (Ka-50)", sender: "", enemy: false, mode: "", time: 271 },
    { msg: "┺STOLR┻ 121telepuzik 已\t斷\t線。", sender: "", enemy: false, mode: "", time: 272 },
    { msg: "121telepuziktd! kd?NET_PLAYER_DISCONNECT_FROM_GAME", sender: "", enemy: false, mode: "", time: 272 },
    { msg: "╔T1FR╕ SSH74 (2S38) 擊\t落\t了 ╔T1FR╕ frank111719 (Ka-50)", sender: "", enemy: false, mode: "", time: 273 },
    { msg: "╔T1FR╕ SunnyEggTw (F-5E) 完\t成\t了\t最\t後\t一\t擊！", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "╔T1FR╕ SunnyEggTw (F-5E) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "╔T1FR╕ 我是阳光开朗大男孩 (紳\t寶 J35XS) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "╔T1FR╕ 我是阳光开朗大男孩 (紳\t寶 J35XS) 獲\t得\t嘉\t獎\t“一\t臂\t之\t力”", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "╔T1FR╕ ReApTiMe (90 式 (B)) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "╔T1FR╕ frank111719 (Ka-50) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "╔T1FR╕ frank111719 (Ka-50) 獲\t得\t嘉\t獎\t“裝\t甲\t剋\t星”", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "┺STOLR┻ Stolyar_off (米\t格\t-27M) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "┺STOLR┻ GeorgeCap (T-80B) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "╔T1FR╕ SSH74 (2S38) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "╔T1FR╕ cupid00772 (90 式) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "╔T1FR╕ Uruha_sky_cat (F-5E) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "┺STOLR┻ Каракуля (A-6E (TRAM)) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "┺STOLR┻ 121telepuzik (豹\t2A4) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "┺STOLR┻ Nefiz_X (豹\t2A4 (第 123 裝\t甲\t營)) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "┺STOLR┻ safari28062000 (Т\t-90\tА) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "╔T1FR╕ neboci (T-80B) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "┺STOLR┻ TBo___cTPax (2S6) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "┺STOLR┻ spik-1 (Ka-50) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "┺STOLR┻ Nefiz_X 已\t斷\t線。", sender: "", enemy: false, mode: "", time: 276 },
    { msg: "Nefiz_Xtd! kd?NET_PLAYER_DISCONNECT_FROM_GAME", sender: "", enemy: false, mode: "", time: 276 },
    { msg: "┺STOLR┻ spik-1 已\t斷\t線。", sender: "", enemy: false, mode: "", time: 276 },
    { msg: "spik-1td! kd?NET_PLAYER_DISCONNECT_FROM_GAME", sender: "", enemy: false, mode: "", time: 276 },
    { msg: "┺STOLR┻ Stolyar_off 已\t斷\t線。", sender: "", enemy: false, mode: "", time: 277 },
    { msg: "Stolyar_offtd! kd?NET_PLAYER_DISCONNECT_FROM_GAME", sender: "", enemy: false, mode: "", time: 277 },
    { msg: "┺STOLR┻ Каракуля 已\t斷\t線。", sender: "", enemy: false, mode: "", time: 277 },
    { msg: "Каракуляtd! kd?NET_PLAYER_DISCONNECT_FROM_GAME", sender: "", enemy: false, mode: "", time: 277 },
    { msg: "╔T1FR╕ SunnyEggTw 已\t斷\t線。", sender: "", enemy: false, mode: "", time: 277 },
    { msg: "SunnyEggTwtd! kd?NET_PLAYER_DISCONNECT_FROM_GAME", sender: "", enemy: false, mode: "", time: 277 },
    { msg: "╔T1FR╕ cupid00772 已\t斷\t線。", sender: "", enemy: false, mode: "", time: 277 },
    { msg: "cupid00772td! kd?NET_PLAYER_DISCONNECT_FROM_GAME", sender: "", enemy: false, mode: "", time: 277 },
];

const match2 = [
    { msg: "┾FAMES┿ Wegne (2S6) 擊\t落\t了 ╔T1FR╕ SSH74 (微\t型\t無\t人\t偵\t察\t機)", sender: "", enemy: false, mode: "", time: 96 },
    { msg: "┾FAMES┿ Wegne (2S6) 先\t拔\t頭\t籌！", sender: "", enemy: false, mode: "", time: 97 },
    { msg: "╔T1FR╕ SunnyEggTw (F-5E) 攻\t擊\t引\t燃 ┾FAMES┿ _Kroenen_ (雅\t克\t-38)", sender: "", enemy: false, mode: "", time: 128 },
    { msg: "╔T1FR╕ SunnyEggTw (F-5E) 擊\t落\t了 ┾FAMES┿ _Kroenen_ (雅\t克\t-38)", sender: "", enemy: false, mode: "", time: 130 },
    { msg: "╔T1FR╕ ReApTiMe (90 式 (B)) 獲\t得\t嘉\t獎\t“團\t隊\t協\t作\t×1”", sender: "", enemy: false, mode: "", time: 130 },
    { msg: "╔T1FR╕ SSH74 (2S38) 獲\t得\t嘉\t獎\t“團\t隊\t協\t作\t×1”", sender: "", enemy: false, mode: "", time: 130 },
    { msg: "╔T1FR╕ cupid00772 (90 式) 獲\t得\t嘉\t獎\t“團\t隊\t協\t作\t×1”", sender: "", enemy: false, mode: "", time: 130 },
    { msg: "┾FAMES┿ Murphy_KP (2S38) 的\t攻\t擊\t重\t創\t了 ╔T1FR╕ SunnyEggTw (F-5E)", sender: "", enemy: false, mode: "", time: 138 },
    { msg: "╔T1FR╕ 我是阳光开朗大男孩 (F-5E) 的\t攻\t擊\t重\t創\t了 ┾FAMES┿ LOKER59512 (蘇\t-25)", sender: "", enemy: false, mode: "", time: 152 },
    { msg: "╔T1FR╕ 我是阳光开朗大男孩 (F-5E) 擊\t落\t了 ┾FAMES┿ LOKER59512 (蘇\t-25)", sender: "", enemy: false, mode: "", time: 156 },
    { msg: "╔T1FR╕ frank111719 (Ka-50) 的\t攻\t擊\t重\t創\t了 ┾FAMES┿ TAHKNCT_Richard (Ka-50)", sender: "", enemy: false, mode: "", time: 157 },
    { msg: "╔T1FR╕ frank111719 (Ka-50) 攻\t擊\t引\t燃 ┾FAMES┿ TAHKNCT_Richard (Ka-50)", sender: "", enemy: false, mode: "", time: 157 },
    { msg: "╔T1FR╕ frank111719 (Ka-50) 擊\t落\t了 ┾FAMES┿ TAHKNCT_Richard (Ka-50)", sender: "", enemy: false, mode: "", time: 158 },
    { msg: "╔T1FR╕ ReApTiMe (90 式 (B)) 獲\t得\t嘉\t獎\t“團\t隊\t協\t作\t×2”", sender: "", enemy: false, mode: "", time: 158 },
    { msg: "╔T1FR╕ SSH74 (2S38) 獲\t得\t嘉\t獎\t“團\t隊\t協\t作\t×2”", sender: "", enemy: false, mode: "", time: 158 },
    { msg: "┾FAMES┿ _Murk_ (T-72AV (TURMS)) 擊\t毀\t了 ╔T1FR╕ cupid00772 (90 式)", sender: "", enemy: false, mode: "", time: 161 },
    { msg: "┾FAMES┿ Murphy_KP (2S38) 擊\t落\t了 ╔T1FR╕ SunnyEggTw (F-5E)", sender: "", enemy: false, mode: "", time: 183 },
    { msg: "╔T1FR╕ Uruha_sky_cat (F-5E) 的\t攻\t擊\t重\t創\t了 ┾FAMES┿ Riki-Maru (Ka-50)", sender: "", enemy: false, mode: "", time: 184 },
    { msg: "╔T1FR╕ Uruha_sky_cat (F-5E) 擊\t落\t了 ┾FAMES┿ Riki-Maru (Ka-50)", sender: "", enemy: false, mode: "", time: 184 },
    { msg: "╔T1FR╕ Uruha_sky_cat (F-5E) 攻\t擊\t引\t燃 ┾FAMES┿ Riki-Maru (Ka-50)", sender: "", enemy: false, mode: "", time: 184 },
    { msg: "╔T1FR╕ Uruha_sky_cat (F-5E) 擊\t毀\t了 ┾FAMES┿ Murphy_KP (2S38)", sender: "", enemy: false, mode: "", time: 224 },
    { msg: "╔T1FR╕ Uruha_sky_cat (F-5E) 獲\t得\t嘉\t獎\t“戰\t鬥\t機\t救\t星”", sender: "", enemy: false, mode: "", time: 224 },
    { msg: "╔T1FR╕ Uruha_sky_cat (F-5E) 獲\t得\t嘉\t獎\t“同\t仇\t敵\t愾”", sender: "", enemy: false, mode: "", time: 224 },
    { msg: "┾FAMES┿ fliMORTIsky (豹\t2A4) 攻\t擊\t引\t燃 ╔T1FR╕ ReApTiMe (90 式 (B))", sender: "", enemy: false, mode: "", time: 231 },
    { msg: "╔T1FR╕ Uruha_sky_cat (F-5E) 擊\t毀\t了 ┾FAMES┿ Wegne (2S6)", sender: "", enemy: false, mode: "", time: 239 },
    { msg: "╔T1FR╕ Uruha_sky_cat (F-5E) 獲\t得\t嘉\t獎\t“連\t續\t無\t傷\t殲\t敵\t×3！”", sender: "", enemy: false, mode: "", time: 240 },
    { msg: "╔T1FR╕ Uruha_sky_cat (F-5E) 獲\t得\t嘉\t獎\t“雙\t殺！”", sender: "", enemy: false, mode: "", time: 240 },
    { msg: "╔T1FR╕ frank111719 (Ka-50) 擊\t毀\t了 ┾FAMES┿ fliMORTIsky (豹\t2A4)", sender: "", enemy: false, mode: "", time: 248 },
    { msg: "╔T1FR╕ 我是阳光开朗大男孩 (F-5E) 獲\t得\t嘉\t獎\t“火\t力\t支\t援\t×1！”", sender: "", enemy: false, mode: "", time: 249 },
    { msg: "╔T1FR╕ ReApTiMe (90 式 (B)) 獲\t得\t嘉\t獎\t“火\t力\t支\t援\t×1！”", sender: "", enemy: false, mode: "", time: 249 },
    { msg: "╔T1FR╕ ReApTiMe (90 式 (B)) 獲\t得\t嘉\t獎\t“團\t隊\t協\t作\t×3”", sender: "", enemy: false, mode: "", time: 249 },
    { msg: "╔T1FR╕ frank111719 (Ka-50) 獲\t得\t嘉\t獎\t“地\t面\t部\t隊\t救\t星”", sender: "", enemy: false, mode: "", time: 249 },
    { msg: "╔T1FR╕ SSH74 (2S38) 獲\t得\t嘉\t獎\t“團\t隊\t協\t作\t×3”", sender: "", enemy: false, mode: "", time: 249 },
    { msg: "┾FAMES┿ _Kroenen_ 已\t斷\t線。", sender: "", enemy: false, mode: "", time: 251 },
    { msg: "_Kroenen_td! kd?NET_PLAYER_DISCONNECT_FROM_GAME", sender: "", enemy: false, mode: "", time: 251 },
    { msg: "┾FAMES┿ Wegne 已\t斷\t線。", sender: "", enemy: false, mode: "", time: 253 },
    { msg: "Wegnetd! kd?NET_PLAYER_DISCONNECT_FROM_GAME", sender: "", enemy: false, mode: "", time: 253 },
    { msg: "╔T1FR╕ SunnyEggTw 已\t斷\t線。", sender: "", enemy: false, mode: "", time: 257 },
    { msg: "SunnyEggTwtd! kd?NET_PLAYER_DISCONNECT_FROM_GAME", sender: "", enemy: false, mode: "", time: 257 },
    { msg: "╔T1FR╕ SSH74 (2S38) 擊\t毀\t了 ┾FAMES┿ _Murk_ (T-72AV (TURMS))", sender: "", enemy: false, mode: "", time: 258 },
    { msg: "┾FAMES┿ _Murk_ (T-72AV (TURMS)) 擊\t毀\t了 ╔T1FR╕ ReApTiMe (90 式 (B))", sender: "", enemy: false, mode: "", time: 258 },
    { msg: "╔T1FR╕ 我是阳光开朗大男孩 (F-5E) 獲\t得\t嘉\t獎\t“團\t隊\t協\t作\t×1”", sender: "", enemy: false, mode: "", time: 258 },
    { msg: "╔T1FR╕ frank111719 (Ka-50) 獲\t得\t嘉\t獎\t“團\t隊\t協\t作\t×1”", sender: "", enemy: false, mode: "", time: 258 },
    { msg: "╔T1FR╕ SSH74 (2S38) 獲\t得\t嘉\t獎\t“戰\t車\t救\t星\t×1”", sender: "", enemy: false, mode: "", time: 258 },
    { msg: "╔T1FR╕ cupid00772 (90 式) 獲\t得\t嘉\t獎\t“火\t力\t支\t援\t×1！”", sender: "", enemy: false, mode: "", time: 258 },
    { msg: "╔T1FR╕ Uruha_sky_cat (F-5E) 獲\t得\t嘉\t獎\t“團\t隊\t協\t作\t×1”", sender: "", enemy: false, mode: "", time: 258 },
    { msg: "╔T1FR╕ neboci (2S38) 獲\t得\t嘉\t獎\t“團\t隊\t協\t作\t×1”", sender: "", enemy: false, mode: "", time: 258 },
    { msg: "┾FAMES┿ Riki-Maru 已\t斷\t線。", sender: "", enemy: false, mode: "", time: 262 },
    { msg: "Riki-Marutd! kd?NET_PLAYER_DISCONNECT_FROM_GAME", sender: "", enemy: false, mode: "", time: 262 },
    { msg: "┾FAMES┿ TAHKNCT_Richard 已\t斷\t線。", sender: "", enemy: false, mode: "", time: 264 },
    { msg: "TAHKNCT_Richardtd! kd?NET_PLAYER_DISCONNECT_FROM_GAME", sender: "", enemy: false, mode: "", time: 264 },
    { msg: "┾FAMES┿ _Murk_ 已\t斷\t線。", sender: "", enemy: false, mode: "", time: 270 },
    { msg: "_Murk_td! kd?NET_PLAYER_DISCONNECT_FROM_GAME", sender: "", enemy: false, mode: "", time: 270 },
    { msg: "┾FAMES┿ LOKER59512 已\t斷\t線。", sender: "", enemy: false, mode: "", time: 270 },
    { msg: "LOKER59512td! kd?NET_PLAYER_DISCONNECT_FROM_GAME", sender: "", enemy: false, mode: "", time: 270 },
    { msg: "╔T1FR╕ SSH74 (2S38) 的\t攻\t擊\t重\t創\t了 ╔T1FR╕ frank111719 (Ka-50)", sender: "", enemy: false, mode: "", time: 272 },
    { msg: "╔T1FR╕ cupid00772 已\t斷\t線。", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "cupid00772td! kd?NET_PLAYER_DISCONNECT_FROM_GAME", sender: "", enemy: false, mode: "", time: 274 },
    { msg: "╔T1FR╕ SSH74 (2S38) 擊\t落\t了 ╔T1FR╕ frank111719 (Ka-50)", sender: "", enemy: false, mode: "", time: 275 },
    { msg: "╔T1FR╕ SunnyEggTw (F-5E) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 278 },
    { msg: "╔T1FR╕ 我是阳光开朗大男孩 (F-5E) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 278 },
    { msg: "╔T1FR╕ ReApTiMe (90 式 (B)) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 278 },
    { msg: "╔T1FR╕ frank111719 (Ka-50) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 278 },
    { msg: "┾FAMES┿ Wegne (2S6) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 278 },
    { msg: "┾FAMES┿ TAHKNCT_Richard (Ka-50) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 278 },
    { msg: "┾FAMES┿ Murphy_KP (2S38) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 278 },
    { msg: "┾FAMES┿ Riki-Maru (Ka-50) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 278 },
    { msg: "╔T1FR╕ SSH74 (2S38) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 278 },
    { msg: "╔T1FR╕ cupid00772 (90 式) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 278 },
    { msg: "╔T1FR╕ Uruha_sky_cat (F-5E) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 278 },
    { msg: "╔T1FR╕ Uruha_sky_cat (F-5E) 獲\t得\t嘉\t獎\t“毫\t髮\t無\t傷”", sender: "", enemy: false, mode: "", time: 278 },
    { msg: "╔T1FR╕ Uruha_sky_cat (F-5E) 獲\t得\t嘉\t獎\t“裝\t甲\t剋\t星”", sender: "", enemy: false, mode: "", time: 278 },
    { msg: "┾FAMES┿ fliMORTIsky (豹\t2A4) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 278 },
    { msg: "┾FAMES┿ fliMORTIsky (豹\t2A4) 獲\t得\t嘉\t獎\t“一\t臂\t之\t力”", sender: "", enemy: false, mode: "", time: 278 },
    { msg: "┾FAMES┿ _Murk_ (T-72AV (TURMS)) 完\t成\t了\t最\t後\t一\t擊！", sender: "", enemy: false, mode: "", time: 278 },
    { msg: "┾FAMES┿ _Murk_ (T-72AV (TURMS)) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 278 },
    { msg: "┾FAMES┿ _Murk_ (T-72AV (TURMS)) 獲\t得\t嘉\t獎\t“刀\t尖\t舔\t血”", sender: "", enemy: false, mode: "", time: 278 },
    { msg: "┾FAMES┿ _Kroenen_ (雅\t克\t-38) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 278 },
    { msg: "┾FAMES┿ LOKER59512 (蘇\t-25) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 278 },
    { msg: "╔T1FR╕ neboci (2S38) 獲\t得\t嘉\t獎\t“最\t佳\t小\t隊”", sender: "", enemy: false, mode: "", time: 278 },
];

const samples = match1.concat(match2).map(({ msg, time }) => ({ msg, time }));

function smaplerFactory() {
    let index = 0;

    return length => {
        const end = index + length;
        const data = end < samples.length ? samples.slice(index, end) : [...samples.slice(index), ...samples.slice(0, end - samples.length)];
        index = end % samples.length;
        return data;
    };
}

const sampler = smaplerFactory();

function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let data = [];
const app = express();
app.use(cors());

const server = app.listen(8111, () => {
    console.log("Server Start");
    setInterval(() => {
        const maxId = data.length;
        const damage = sampler(randomIntFromInterval(10, 40)).map((it, index) => ({
            ...it,
            id: maxId + index + 1,
        }));
        data.push(...damage);

        if (data.length / samples.length > 2) data = data.slice(samples.length);
    }, 2000);
});

app.get("/hudmsg", (req, res) => {
    const lastDmg = parseInt(req.query.lastDmg) ?? 0;
    const sliceIndex = data.findIndex(it => it.id === lastDmg + 1);
    res.json({ damage: sliceIndex === -1 ? data : data.slice(sliceIndex) });
});
