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
    const { event, transfer } = body;

    if (!event || !transfer || !transfer.id) {
      return NextResponse.json(
        { received: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    await prisma.payments.update({
      where: { gateway_payment_id: transfer.id },
      data: {
        status: mapGatewayStatusToLocalStatus(transfer.status),
        payment_date: transfer.effectiveDate,
        receipt_url: transfer.transactionReceiptUrl,
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
