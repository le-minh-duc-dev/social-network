import React from "react"
import Stories from "./Stories"
import Feeds from "./Feeds"

export default function Home() {
  return (
    <div className="flex  flex-col items-center">
      <Stories />
      <Feeds />
    </div>
  )
}
