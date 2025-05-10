import React from "react"

import Feeds from "./Feeds"
import Stories from "./Stories"

export default function Home() {
  return (
    <>
      <div className="flex justify-center mb-8">
        <Stories />
      </div>
      <Feeds />
    </>
  )
}
