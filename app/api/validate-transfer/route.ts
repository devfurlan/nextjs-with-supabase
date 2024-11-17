import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
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
          refuseReason: "ID da transferência não foi fornecido",
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
        pix_key: {
          equals: transfer.bankAccount.pixAddressKey,
        },
      },
      include: {
        Partner: true,
      },
    });

    const paymentIsValid =
      payment && payment.Partner?.full_name === transfer.bankAccount.ownerName;

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
          refuseReason: "Transferência não encontrada no nosso banco",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Erro na validação da transferência:", error);
    return NextResponse.json(
      {
        status: "REFUSED",
        refuseReason: "Erro interno no servidor",
      },
      { status: 500 }
    );
  }
}
