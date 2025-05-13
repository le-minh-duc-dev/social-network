import { User } from "@/types/schema"
import { Switch } from "@heroui/react"
import React from "react"

export default function ActiveToggle({
  user,

}: Readonly<{
  user: User
 
}>) {
  return (
    <Switch
      size="sm"
      defaultSelected={user.isActive}
      color={user.isActive ? "success" : "danger"}
    >
      {user.isActive ? "Active" : "Inactive"}
    </Switch>
  )
}
