import { RouteProtector } from "@/auth/RouteProtector"
import Reels from "@/component/reel/Reels"
import React from "react"

export default async function page() {
  await RouteProtector.protect()
  return <Reels />
}
