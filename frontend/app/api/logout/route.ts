import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  if (token) {
    await fetch(`${process.env.API_BASE_URL}/api/auth/logout/`, {
      method: "POST",
      headers: { Cookie: `access_token=${token}` },
    }).catch(() => null);
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.delete("access_token");
  return res;
}