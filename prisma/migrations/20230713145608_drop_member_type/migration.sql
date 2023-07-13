-- CreateTable
CREATE TABLE "news" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "page_url" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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

-- CreateTable
CREATE TABLE "members" (
    "discord_id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "game_accounts" (
    "num" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id" TEXT NOT NULL,
    "personal_rating" INTEGER NOT NULL,
    "activity" INTEGER NOT NULL,
    "join_date" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "member_id" TEXT,
    "account_type" INTEGER,
    "is_exist" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "game_accounts_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("discord_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "configs" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "sections" (
    "from_date" DATETIME NOT NULL,
    "to_date" DATETIME NOT NULL,
    "battle_rating" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "penalty_point_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "member_discord_id" TEXT,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    CONSTRAINT "penalty_point_logs_member_discord_id_fkey" FOREIGN KEY ("member_discord_id") REFERENCES "members" ("discord_id") ON DELETE NO ACTION ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reward_point_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "member_discord_id" TEXT,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    CONSTRAINT "reward_point_logs_member_discord_id_fkey" FOREIGN KEY ("member_discord_id") REFERENCES "members" ("discord_id") ON DELETE NO ACTION ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "absence_point_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "member_discord_id" TEXT,
    "delta" REAL NOT NULL,
    "reason" TEXT NOT NULL,
    CONSTRAINT "absence_point_logs_member_discord_id_fkey" FOREIGN KEY ("member_discord_id") REFERENCES "members" ("discord_id") ON DELETE NO ACTION ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "members_discord_id_key" ON "members"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "game_accounts_id_key" ON "game_accounts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "sections_from_date_key" ON "sections"("from_date");

-- CreateIndex
CREATE UNIQUE INDEX "sections_to_date_key" ON "sections"("to_date");

-- CreateIndex
CREATE INDEX "sections_from_date_to_date_idx" ON "sections"("from_date", "to_date");
