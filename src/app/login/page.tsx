import { RouteProtector } from "@/auth/RouteProtector"
import Login from "@/component/Login"

import React from "react"

export default async function page() {
  await RouteProtector.protectLoginAgain()
  return <Login />
}
