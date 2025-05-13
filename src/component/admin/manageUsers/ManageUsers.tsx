"use client"
import React from "react"
import TotalUsers from "./TotalUsers"
import UserList from "./userList/UserList"

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
