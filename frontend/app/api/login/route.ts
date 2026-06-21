import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.formData().catch(() => null);
  let username: string, password: string;

  if (body) {
    username = body.get("username") as string;
    password = body.get("password") as string;
  } else {
    const json = await req.json();
    username = json.username;
    password = json.password;
  }

  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const backendResp = await fetch(`${process.env.API_BASE_URL}/api/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  const data = await backendResp.json().catch(() => null);

  if (!backendResp.ok) {
    return NextResponse.json(data ?? { detail: "Login failed" }, { status: backendResp.status });
  }

  const res = NextResponse.json(data);
  res.cookies.set("access_token", data.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // match your backend's ACCESS_TOKEN_EXPIRE_MINUTES, in seconds
  });

  return res;
}