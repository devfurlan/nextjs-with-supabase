import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { mapGatewayStatusToLocalStatus } from "@/utils/mapGatewayStatus";
import { validateAccessToken } from "@/utils/validateAccessToken";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const validationResponse = validateAccessToken(request);
    if (validationResponse) {
      return NextResponse.json(
        { received: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { event, payment } = body;

    if (!event || !payment || !payment.id) {
      return NextResponse.json(
        { received: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    await prisma.payments.update({
      where: { gateway_payment_id: payment.id },
      data: {
        status: mapGatewayStatusToLocalStatus(payment.status),
        payment_date: payment.effectiveDate,
        receipt_url: payment.transactionReceiptUrl,
      },
    });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      {
        received: false,
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
