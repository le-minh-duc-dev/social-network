import { RouteProtector } from "@/auth/RouteProtector"
import Dashboard from "@/component/admin/dashBoard/Dashboard"
import { Role } from "@/domain/enums/Role"
import React from "react"

export default async function page() {
  await RouteProtector.protect(Role.ADMIN)
  return <Dashboard />
}
