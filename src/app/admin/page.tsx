import { RouteProtector } from "@/auth/RouteProtector"
import UnderConstruction from "@/component/UnderConstruction"
import { Role } from "@/domain/enums/Role"
import React from "react"

export default async function page() {
  await RouteProtector.protect(Role.ADMIN)
  return <UnderConstruction />
}
