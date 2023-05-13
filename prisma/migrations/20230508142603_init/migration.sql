/*
  Warnings:

  - The primary key for the `members` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uniqueId` on the `members` table. All the data in the column will be lost.
  - Added the required column `unique_id` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_members" (
    "unique_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "member_type" INTEGER NOT NULL
);
INSERT INTO "new_members" ("id", "member_type", "nickname") SELECT "id", "member_type", "nickname" FROM "members";
DROP TABLE "members";
ALTER TABLE "new_members" RENAME TO "members";
CREATE UNIQUE INDEX "members_id_key" ON "members"("id");
CREATE TABLE "new_configs" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
);
INSERT INTO "new_configs" ("key", "value") SELECT "key", "value" FROM "configs";
DROP TABLE "configs";
ALTER TABLE "new_configs" RENAME TO "configs";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
