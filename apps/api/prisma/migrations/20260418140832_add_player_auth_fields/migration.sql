/*
  Warnings:

  - A unique constraint covering the columns `[githubId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "githubId" TEXT,
ADD COLUMN     "githubLogin" TEXT,
ADD COLUMN     "pin" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Player_githubId_key" ON "Player"("githubId");
