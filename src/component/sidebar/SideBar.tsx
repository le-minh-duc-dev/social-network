"use client"
import React, { useState } from "react"
import { Pacifico } from "next/font/google"
import LinkList from "./LinkList"
import More from "./More"
import { useAuth } from "@/component/provider/auth/AuthContext"
import { usePathname } from "next/navigation"
import Search from "./search/Search"
import NotificationPanel from "./notification/NotificationPanel"
import { SIDEBAR_WIDTH } from "@/domain/enums/SidebarWidth"
import MobileBar from "./mobile/MobileBar"
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
    <>
      <MobileBar />
      <div
        className={`fixed  flex-col hidden md:flex border-r top-0 left-0 h-screen border-r-white/15  p-2 lg:pl-6 lg:pr-4 pt-12 z-10  ${SIDEBAR_WIDTH}`}
      >
        <h2 className={pacifico.className + ` text-xl hidden lg:inline`}>
          Social Network
        </h2>
        <div className="mt-16 flex flex-col justify-between items-center lg:items-start max-h-full flex-1 pb-8">
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
    </>
  )
}
