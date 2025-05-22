-- AlterTable
CREATE SEQUENCE students_id_seq;
ALTER TABLE "students" ALTER COLUMN "id" SET DEFAULT nextval('students_id_seq');
ALTER SEQUENCE students_id_seq OWNED BY "students"."id";
