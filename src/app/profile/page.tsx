import { RouteProtector } from "@/auth/RouteProtector"
import Profile from "@/component/profile/Profile"
import React from "react"

export default async function page() {
  await RouteProtector.protect()
  return <Profile/>
}
