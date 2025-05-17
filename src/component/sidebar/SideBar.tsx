"use client"
import React, { useState } from "react"
import { Pacifico } from "next/font/google"
import LinkList from "./LinkList"
import More from "./More"
import { useAuth } from "@/component/provider/auth/AuthContext"
import { usePathname } from "next/navigation"
import Search from "./search/Search"
import NotificationPanel from "./notification/NotificationPanel"
const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
})
export default function Sidebar() {
  const { isAuthenticated, isLoading } = useAuth()
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false)
  if ((!isAuthenticated && !isLoading) || pathname.startsWith("/admin"))
    return null
  return (
    <div className="fixed lg:w-72 2xl:w-[345px] flex flex-col border-r top-0 left-0 h-screen border-r-white/15 pl-6 pr-4 pt-12 z-10 ">
      <h2 className={pacifico.className + ` text-xl`}>Social Network</h2>
      <div className="mt-16 flex flex-col justify-between max-h-full flex-1 pb-8">
        <LinkList
          isSearchOpen={isSearchOpen}
          isNotificationPanelOpen={isNotificationPanelOpen}
          setIsSearchOpen={setIsSearchOpen}
          setIsNotificationPanelOpen={setIsNotificationPanelOpen}
        />
        <More />
      </div>
      {isSearchOpen && <Search setIsSearchOpen={setIsSearchOpen} />}
      {isNotificationPanelOpen && (
        <NotificationPanel setIsOpen={setIsNotificationPanelOpen} />
      )}
    </div>
  )
}
