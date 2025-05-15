import { RouteProtector } from "@/auth/RouteProtector"
import Reels from "@/component/reels/Reels"
import React from "react"

export default async function page() {
  await RouteProtector.protect()
  return <Reels />
}
