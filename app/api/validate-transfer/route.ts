import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Parse o JSON recebido no corpo da requisição
    const body = await request.json();

    // Extraia o ID da transferência
    const transferId = body?.transfer?.id;

    if (!transferId) {
      return NextResponse.json(
        {
          status: "REFUSED",
          refuseReason: "ID da transferência não foi fornecido",
        },
        { status: 400 }
      );
    }

    // Verifique se há registros na tabela Orders com o ID fornecido
    const order = await prisma.orders.findUnique({
      where: { id: transferId },
    });

    if (order) {
      // Se o registro for encontrado
      return NextResponse.json(
        {
          status: "APPROVED",
        },
        { status: 200 }
      );
    } else {
      // Caso contrário
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

    // Resposta de erro genérica
    return NextResponse.json(
      {
        status: "REFUSED",
        refuseReason: "Erro interno no servidor",
      },
      { status: 500 }
    );
  }
}
