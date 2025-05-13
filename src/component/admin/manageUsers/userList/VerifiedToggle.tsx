import { User } from "@/types/schema"
import { Switch } from "@heroui/react"
import React from "react"

export default function VerifiedToggle({
  user,
}: Readonly<{
  user: User
}>) {
  return (
    <Switch size="sm" defaultSelected={user.isVerified} color={"success"}>
      {user.isVerified ? "Verified" : "Unverified"}
    </Switch>
  )
}
