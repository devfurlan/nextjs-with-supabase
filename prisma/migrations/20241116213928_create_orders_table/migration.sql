-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'partial', 'paid');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'completed', 'canceled');

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "partner_id" TEXT NOT NULL,
    "service_date" TIMESTAMP(3) NOT NULL,
    "total_value" DECIMAL(65,30) NOT NULL,
    "partner_payment_value" DECIMAL(65,30) NOT NULL,
    "received_value" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "paid_to_partner" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "payment_status_customer" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "payment_status_partner" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "Partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
