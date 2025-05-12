"use client"
import { ReactNode } from "react"
import ActionList from "./ActionList"

export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className=" h-full overflow-hidden grid grid-cols-6">
      <div className="col-span-1  p-4 border-r border-white/15">
        <h1 className="text-2xl font-bold  mt-4">Admin</h1>
        <ActionList />
      </div>
      <div className="col-span-5">{children}</div>
    </div>
  )
}
