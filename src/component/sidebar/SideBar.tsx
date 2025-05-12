"use client"
import React from "react"
import { Pacifico } from "next/font/google"
import LinkList from "./LinkList"
import More from "./More"
import { useAuth } from "@/hooks/useAuth"
import { usePathname } from "next/navigation"
const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
})
export default function Sidebar() {
  const { isAuthenticated } = useAuth()
  const pathname = usePathname()
  if (!isAuthenticated || pathname.startsWith("/admin")) return null
  return (
    <div className="fixed lg:w-72 2xl:w-[345px] flex flex-col border-r top-0 left-0 h-screen border-r-white/15 pl-6 pr-4 pt-12 z-10">
      <h2 className={pacifico.className + ` text-xl`}>Social Network</h2>
      <div className="mt-16 flex flex-col justify-between max-h-full flex-1 pb-8">
        <LinkList />
        <More />
      </div>
    </div>
  )
}
