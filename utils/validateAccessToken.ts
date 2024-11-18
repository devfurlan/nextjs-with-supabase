import { NextResponse } from "next/server";

export function validateAccessToken(req: Request): NextResponse | null {
  const accessToken = req.headers.get("asaas-access-token");

  if (accessToken !== process.env.ASAAS_ACCESS_TOKEN) {
    return NextResponse.json(
      { received: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return null;
}
