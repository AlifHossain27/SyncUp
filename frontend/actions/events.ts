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

export async function create_event(title: string, desc: string, event_date: string, start: string, end: string, location: string, link: string) {
    const resp = await fetch(`${API_BASE_URL}/api/event/create/`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify({
            'title': title,
            'desc': desc,
            'event_date': event_date,
            'start': start,
            'end': end,
            'location': location,
            'link': link
        }),
    })
    const data = await resp.json();
    return { ok: resp.ok, status: resp.status, body: data };
}

export async function update_event(uuid: string, title: string, desc: string, status: string, event_date: Date, start: string, end: string, location: string, link: string) {
    const resp = await fetch(`${API_BASE_URL}/api/event/${uuid}/`, {
        method: 'PATCH',
        headers: await authHeaders(),
        body: JSON.stringify({
            'title': title,
            'desc': desc,
            'status': status,
            'event_date': event_date,
            'start': start,
            'end': end,
            'location': location,
            'link': link
        }),
    })
    const data = await resp.json();
    return { ok: resp.ok, status: resp.status, body: data };
}

export async function get_upcoming_event() {
    const resp = await fetch(`${API_BASE_URL}/api/events/upcoming/`, {
        method: "GET",
        headers: await authHeaders(),
        cache: "no-store",
    })
    const data = await resp.json();
    return data
}

export async function get_recent_event(page: number, limit: number = 3) {
    const resp = await fetch(`${API_BASE_URL}/api/events/recent/?skip=${page * limit}&limit=${limit}`, {
        method: "GET",
        headers: await authHeaders(),
        cache: "no-store",
    })
    const data = await resp.json();
    return { ok: resp.ok, status: resp.status, body: data };
}