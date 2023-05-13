/*
  Warnings:

  - The primary key for the `members` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `unique_id` on the `members` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `members` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to drop the column `member_id` on the `absence_point_logs` table. All the data in the column will be lost.
  - You are about to alter the column `member_id` on the `penalty_point_logs` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `member_id` on the `reward_point_logs` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `discord_id` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Vehicle" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "class" TEXT NOT NULL,
    "subclass" TEXT NOT NULL,
    "nation" TEXT NOT NULL,
    "english_name" TEXT NOT NULL,
    "chinese_name" TEXT,
    "arcade_br" REAL NOT NULL,
    "realistic_br" REAL NOT NULL,
    "simulate_br" REAL NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_members" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "discord_id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "member_type" INTEGER NOT NULL
);
INSERT INTO "new_members" ("id", "member_type", "nickname") SELECT "id", "member_type", "nickname" FROM "members";
DROP TABLE "members";
ALTER TABLE "new_members" RENAME TO "members";
CREATE UNIQUE INDEX "members_discord_id_key" ON "members"("discord_id");
CREATE TABLE "new_absence_point_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "member_discord_id" TEXT,
    "delta" REAL NOT NULL,
    "reason" TEXT NOT NULL,
    CONSTRAINT "absence_point_logs_member_discord_id_fkey" FOREIGN KEY ("member_discord_id") REFERENCES "members" ("discord_id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_absence_point_logs" ("delta", "id", "reason") SELECT "delta", "id", "reason" FROM "absence_point_logs";
DROP TABLE "absence_point_logs";
ALTER TABLE "new_absence_point_logs" RENAME TO "absence_point_logs";
CREATE TABLE "new_penalty_point_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "member_id" INTEGER,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    CONSTRAINT "penalty_point_logs_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_penalty_point_logs" ("delta", "id", "member_id", "reason") SELECT "delta", "id", "member_id", "reason" FROM "penalty_point_logs";
DROP TABLE "penalty_point_logs";
ALTER TABLE "new_penalty_point_logs" RENAME TO "penalty_point_logs";
CREATE TABLE "new_game_accounts" (
    "num" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id" TEXT NOT NULL,
    "personal_rating" INTEGER NOT NULL,
    "activity" INTEGER NOT NULL,
    "join_date" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "member_id" TEXT,
    "account_type" INTEGER,
    CONSTRAINT "game_accounts_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("discord_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_game_accounts" ("account_type", "activity", "id", "join_date", "member_id", "num", "personal_rating", "title") SELECT "account_type", "activity", "id", "join_date", "member_id", "num", "personal_rating", "title" FROM "game_accounts";
DROP TABLE "game_accounts";
ALTER TABLE "new_game_accounts" RENAME TO "game_accounts";
CREATE TABLE "new_reward_point_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "member_id" INTEGER,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    CONSTRAINT "reward_point_logs_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_reward_point_logs" ("delta", "id", "member_id", "reason") SELECT "delta", "id", "member_id", "reason" FROM "reward_point_logs";
DROP TABLE "reward_point_logs";
ALTER TABLE "new_reward_point_logs" RENAME TO "reward_point_logs";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
