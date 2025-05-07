import { RouteProtector } from "@/auth/RouteProtector"
import React from "react"

export default async function page() {
  await RouteProtector.protect()
  return <div>create</div>
}
