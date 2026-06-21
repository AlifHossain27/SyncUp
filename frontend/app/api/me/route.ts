import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  const backendResp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${token}`,
    },
  });

  const data = await backendResp.json().catch(() => null);
  return NextResponse.json(data, { status: backendResp.status });
}