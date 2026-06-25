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

export async function get_subscriber() {
    const resp = await fetch(`${API_BASE_URL}/api/subscribers/`, {
        method: 'GET',
        headers: await authHeaders(),
        cache: "no-store",
    })
    const data = await resp.json();
    return { ok: resp.ok, status: resp.status, body: data };
}

export async function add_subscriber(first_name: string, last_name: string, email: string, department: string, subscriber_type: string) {
    const resp = await fetch(`${API_BASE_URL}/api/subscriber/create/`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify({
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'department': department,
            'subscriber_type': subscriber_type
        })
    })
    const data = await resp.json();
    return { ok: resp.ok, status: resp.status, body: data };
}


export async function new_subscriber(first_name: string, last_name: string, email: string, department: string) {
    const resp = await fetch(`${API_BASE_URL}/api/subscriber/new/`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify({
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'department': department,
            'subscriber_type': "General"
        })
    })
    const data = await resp.json();
    return { ok: resp.ok, status: resp.status, body: data };
}

export async function update_subscriber(uuid: string, first_name: string, last_name: string, email: string, department: string, subscriber_type: string) {
    const resp = await fetch(`${API_BASE_URL}/api/subscriber/${uuid}/`, {
        method: 'PATCH',
        headers: await authHeaders(),
        body: JSON.stringify({
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'department': department,
            'subscriber_type': subscriber_type
        })
    })
    const data = await resp.json();
    return { ok: resp.ok, status: resp.status, body: data };
}

export async function delete_subscriber(uuid: string) {
    const resp = await fetch(`${API_BASE_URL}/api/subscriber/${uuid}/`, {
        method: 'DELETE',
        headers: await authHeaders(),
    })
    let data = null;
    if (resp.status !== 204) {
        try {
            data = await resp.json();
        } catch (e) {
            console.warn("No JSON to parse:", e);
        }
    }
    return { ok: resp.ok, status: resp.status, body: data };
}

export async function uploadSubscribersFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const cookieStore = await cookies();

    const resp = await fetch(`${API_BASE_URL}/api/subscriber/upload/`, {
        method: "POST",
        headers: { Cookie: cookieStore.toString() }, // no Content-Type — let fetch set multipart boundary
        body: formData,
    });

    let data = null;
    try {
        data = await resp.json();
    } catch (e) {
        console.warn("No JSON returned from upload:", e);
    }

    return { ok: resp.ok, status: resp.status, body: data };
}