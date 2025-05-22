-- DropIndex
DROP INDEX "class_name_key";

-- AlterTable
ALTER TABLE "allowed_users" ALTER COLUMN "last_login_at" DROP NOT NULL;
