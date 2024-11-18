import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAccessToken } from "@/utils/validateAccessToken";

export async function POST(request: Request) {
  try {
    const validationResponse = validateAccessToken(request);
    if (validationResponse) {
      return NextResponse.json(
        {
          status: "REFUSED",
          refuseReason: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const transfer = body?.transfer;

    if (
      body?.type !== "TRANSFER" ||
      transfer.operationType !== "PIX" ||
      !transfer.id
    ) {
      return NextResponse.json(
        {
          status: "REFUSED",
          refuseReason: "Transfer ID was not provided",
        },
        { status: 400 }
      );
    }

    const payment = await prisma.payments.findFirst({
      where: {
        gateway_payment_id: transfer.id,
        amount: {
          equals: Number(transfer.value),
        },
        pix_key: transfer.bankAccount.pixAddressKey,
      },
    });
    const paymentIsValid = payment;

    // With partner
    //*
    // const payment = await prisma.payments.findFirst({
    //   where: {
    //     gateway_payment_id: transfer.id,
    //     amount: {
    //       equals: Number(transfer.value),
    //     },
    //     pix_key: transfer.bankAccount.pixAddressKey,
    //   },
    //   include: {
    //     Partner: true,
    //   },
    // });
    // const paymentIsValid =
    //   payment && payment.Partner?.full_name === transfer.bankAccount.ownerName;

    if (paymentIsValid) {
      return NextResponse.json(
        {
          status: "APPROVED",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: "REFUSED",
          refuseReason: "Transfer not found in our database",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error in transfer validation:", error);
    return NextResponse.json(
      {
        status: "REFUSED",
        refuseReason: "Internal server error",
      },
      { status: 500 }
    );
  }
}
