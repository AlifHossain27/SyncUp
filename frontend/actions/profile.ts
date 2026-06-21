"use server";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function authHeaders() {
    const cookieStore = await cookies();
    return {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
    };
}

export async function get_profile() {
    const resp = await fetch(`${API_BASE_URL}/api/user/me/`, {
        method: "GET",
        headers: await authHeaders(),
        cache: "no-store",
    });
    const data = await resp.json().catch(() => null);
    return { ok: resp.ok, status: resp.status, body: data };
}

export async function update_profile(username: string, email: string) {
    const resp = await fetch(`${API_BASE_URL}/api/user/me/`, {
        method: "PATCH",
        headers: await authHeaders(),
        body: JSON.stringify({ username, email }),
    });
    const data = await resp.json().catch(() => null);
    return { ok: resp.ok, status: resp.status, body: data };
}

export async function change_password(currentPassword: string, newPassword: string, confirmPassword: string) {
    const resp = await fetch(`${API_BASE_URL}/api/user/change-password`, {
        method: "PATCH",
        headers: await authHeaders(),
        body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirm: confirmPassword,
        }),
    });
    const data = await resp.json().catch(() => null);
    return { ok: resp.ok, status: resp.status, body: data };
}