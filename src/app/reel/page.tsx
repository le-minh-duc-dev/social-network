import { RouteProtector } from "@/auth/RouteProtector"
import UnderConstruction from "@/component/UnderConstruction"
import React from "react"

export default async function page() {
  await RouteProtector.protect()
  return <UnderConstruction/>
}
