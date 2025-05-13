"use client"
import React from "react"
import TotalUsers from "./TotalUsers"
import dynamic from "next/dynamic"
import { Skeleton } from "@heroui/react"
const UserList = dynamic(() => import("./userList/UserList"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-96" />,
})

export default function ManageUsers() {
  return (
    <div>
      <div className="flex gap-x-8 m-6 flex-col gap-6">
        <TotalUsers />
        <UserList />
      </div>
    </div>
  )
}
