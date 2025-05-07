import React from "react"
import { Pacifico } from "next/font/google"
import LinkList from "./LinkList"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
})
export default function Sidebar() {
  return (
    
      <div className="fixed lg:w-72 2xl:w-[345px] border-r top-0 left-0 h-screen border-r-white/15 pl-6 pr-4 pt-12">
        <h2 className={pacifico.className + ` text-2xl`}>Social Network</h2>
        <div className="mt-16">
          <LinkList />
        </div>
      </div>
   
  )
}
