/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `class` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "class_name_key" ON "class"("name");
