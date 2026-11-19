/*
  Warnings:

  - The primary key for the `tasks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `completed` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tasks` table. All the data in the column will be lost.
  - Added the required column `dueDate` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responsible` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `tasks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "task_status" AS ENUM ('PENDIENTE', 'EN_CURSO', 'HECHA');

-- AlterTable
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_pkey",
DROP COLUMN "completed",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "responsible" TEXT NOT NULL,
ADD COLUMN     "status" "task_status" NOT NULL DEFAULT 'PENDIENTE',
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "tasks_pkey" PRIMARY KEY ("id");
