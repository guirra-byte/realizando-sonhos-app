/*
  Warnings:

  - You are about to drop the `AttendanceRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Class` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AttendanceRecordToStudent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AttendanceRecordToStudent" DROP CONSTRAINT "_AttendanceRecordToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "_AttendanceRecordToStudent" DROP CONSTRAINT "_AttendanceRecordToStudent_B_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_classId_fkey";

-- DropTable
DROP TABLE "AttendanceRecord";

-- DropTable
DROP TABLE "Class";

-- DropTable
DROP TABLE "_AttendanceRecordToStudent";

-- CreateTable
CREATE TABLE "class" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "minAge" INTEGER NOT NULL,
    "maxAge" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_record" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "arrived" BOOLEAN NOT NULL DEFAULT false,
    "arrivedAt" TIMESTAMP(3),
    "classId" TEXT,
    "studentId" INTEGER,

    CONSTRAINT "attendance_record_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_record" ADD CONSTRAINT "attendance_record_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_record" ADD CONSTRAINT "attendance_record_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;
