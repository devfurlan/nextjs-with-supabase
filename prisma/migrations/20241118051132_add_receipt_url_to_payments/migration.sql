/*
  Warnings:

  - You are about to drop the column `gateway_payment_date` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "gateway_payment_date",
ADD COLUMN     "payment_date" TIMESTAMP(3),
ADD COLUMN     "receipt_url" TEXT;
