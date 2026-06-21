import React from 'react'
import { Subscribers, columns } from "./columns"
import { DataTable } from "./dataTable"
import { cookies } from "next/headers"

async function getData(): Promise<Subscribers[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const cookieStore = await cookies();

  const resp = await fetch(`${API_BASE_URL}/api/subscribers/`, {
    method: "GET",
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });

  if (!resp.ok) {
    console.error("Failed to fetch subscribers:", resp.status);
    return [];
  }

  const data = await resp.json();
  return data;
}

export default async function SubscribersDataTable() {
  const data = await getData()
  return (
    <div className='w-auto col-span-2 overflow-auto relative'>
      <DataTable columns={columns} data={data} />
    </div>
  )
}