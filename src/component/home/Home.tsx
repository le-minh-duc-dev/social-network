import React from "react"

import Feeds from "./Feeds"
import Stories from "./Stories"
import { Pacifico } from "next/font/google"
const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
})
export default function Home() {
  return (
    <>
      <div className="flex md:justify-center mb-8 justify-start">
         <h2 className={pacifico.className + ` text-xl  md:hidden mt-6 ml-4`}>
          Social Network
        </h2>
        <Stories />
      </div>
      <Feeds />
    </>
  )
}
