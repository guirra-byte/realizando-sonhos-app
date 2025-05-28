-- CreateEnum
CREATE TYPE "FactorType" AS ENUM ('POSITIVE', 'NEGATIVE');

-- CreateEnum
CREATE TYPE "MasterStatus" AS ENUM ('ACTIVE', 'UNACTIVE');

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "additional_infos" TEXT,
    "school_year" TEXT NOT NULL,
    "shift" TEXT NOT NULL,
    "guardian" TEXT NOT NULL,
    "guardian_cpf" TEXT NOT NULL,
    "guardian_phone_number" TEXT NOT NULL,
    "classId" INTEGER,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allowed_users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "invited_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "allowed_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notice_factors" (
    "id" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "FactorType" NOT NULL DEFAULT 'POSITIVE',
    "description" TEXT NOT NULL,
    "from" INTEGER NOT NULL,
    "to" INTEGER NOT NULL,
    "attendance_record_id" TEXT,

    CONSTRAINT "notice_factors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Master" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "MasterStatus" NOT NULL DEFAULT 'ACTIVE',
    "phone_number" TEXT NOT NULL,
    "my_class" INTEGER NOT NULL,

    CONSTRAINT "Master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_records" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "present" BOOLEAN NOT NULL DEFAULT false,
    "masterId" INTEGER NOT NULL,
    "classId" INTEGER,
    "studentId" INTEGER,

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_name_key" ON "students"("name");

-- CreateIndex
CREATE UNIQUE INDEX "allowed_users_email_key" ON "allowed_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "class_name_key" ON "class"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Master_email_key" ON "Master"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Master_phone_number_key" ON "Master"("phone_number");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notice_factors" ADD CONSTRAINT "notice_factors_from_fkey" FOREIGN KEY ("from") REFERENCES "Master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notice_factors" ADD CONSTRAINT "notice_factors_to_fkey" FOREIGN KEY ("to") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notice_factors" ADD CONSTRAINT "notice_factors_attendance_record_id_fkey" FOREIGN KEY ("attendance_record_id") REFERENCES "attendance_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Master" ADD CONSTRAINT "Master_my_class_fkey" FOREIGN KEY ("my_class") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "Master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;
