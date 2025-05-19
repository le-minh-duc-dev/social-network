"use client"
import React from "react"
import LinkList from "./LinkList"
import { MARGIN_LEFT_ACCORDING_TO_SIDEBAR_WITH } from "@/domain/enums/SidebarWidth"

export default function UserSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`${MARGIN_LEFT_ACCORDING_TO_SIDEBAR_WITH} grid grid-cols-4 flex-1  overflow-hidden `}>
      <div className=" min-h-full p-4 pt-12 overflow-y-auto border-r border-r-white/15">
        <h1 className="text-xl font-semibold ml-5">Settings</h1>
        <div className="mt-12">
          <LinkList />
        </div>
      </div>
      <div className="col-span-3 h-full px-4">{children}</div>
    </div>
  )
}
