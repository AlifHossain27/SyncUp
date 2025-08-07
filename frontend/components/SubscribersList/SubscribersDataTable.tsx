import React from 'react'
import {  Subscribers, columns } from "./columns"
import { DataTable } from "./dataTable"
import { cookies } from "next/headers"

async function getData(): Promise<Subscribers[]> {
    const resp = await fetch("http://localhost:8000/api/subscribers/",{
        method: "GET",
        headers: { Cookie: cookies().toString() },
        credentials: 'include',
      
    });
    const data = await resp.json()
    return data
}

export default async function SubscribersDataTable() {
    const data = await getData()
    return (
      <div className='w-auto col-span-2 overflow-auto relative'>
        <DataTable columns={columns} data={data} />
      </div>
    )
  }