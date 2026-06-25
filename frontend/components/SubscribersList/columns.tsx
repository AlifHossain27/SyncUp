"use client"
import { ColumnDef } from "@tanstack/react-table"
import UpdateSubscriber from "@/components/SubscribersList/UpdateSubscriber"
import DeleteSubscriber from "./DeleteSubscriber"
import { Badge } from "@/components/ui/badge"

export type SubscriberType = "General" | "Alumni" | "Faculty" | "OCA"

export type Subscribers = {
    uuid: string
    first_name: string
    last_name: string
    email: string
    department: string
    subscriber_type: SubscriberType
}

const typeBadgeColors: Record<SubscriberType, string> = {
    General: "bg-blue-100 text-blue-800",
    Alumni: "bg-purple-100 text-purple-800",
    Faculty: "bg-green-100 text-green-800",
    OCA: "bg-orange-100 text-orange-800",
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
      accessorKey: "subscriber_type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.subscriber_type
        return (
          <Badge className={typeBadgeColors[type] ?? ""} variant="secondary">
            {type}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const data = row.original
        return (
          <div className="flex gap-2">
            <UpdateSubscriber uuid={data.uuid} first_name={data.first_name} last_name={data.last_name} email={data.email} department={data.department} subscriber_type={data.subscriber_type}/>
            <DeleteSubscriber uuid={data.uuid} first_name={data.first_name} last_name={data.last_name} email={data.email} department={data.department}/>
          </div>
        )
      },
    },
  ]