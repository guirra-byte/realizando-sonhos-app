/*
  Warnings:

  - Added the required column `invited_by` to the `allowed_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "allowed_users" ADD COLUMN     "invited_by" TEXT NOT NULL;
