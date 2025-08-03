"use client"
import { ColumnDef } from "@tanstack/react-table"
import UpdateSubscriber from "@/components/SubscribersList/UpdateSubscriber"
import DeleteSubscriber from "./DeleteSubscriber"

export type Subscribers = {
    uuid: string
    first_name: string
    last_name: string
    email: string
    department: string
}

export const columns: ColumnDef<Subscribers>[] = [
    {
      accessorKey: "first_name",
      header: "First Name",
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const data = row.original
        return (
          <div className="flex gap-2">
            <UpdateSubscriber uuid={data.uuid} first_name={data.first_name} last_name={data.last_name} email={data.email} department={data.department}/>
            <DeleteSubscriber uuid={data.uuid} first_name={data.first_name} last_name={data.last_name} email={data.email} department={data.department}/>
          </div>
        )
      },
    },
  ]