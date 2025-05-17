"use client"
// import { useAuth } from "@/component/provider/auth/AuthContext"
import React from "react"
// import { Avatar } from "@heroui/react"
// import { BsPlusCircleFill } from "react-icons/bs"
import Account from "./Account"

export default function Stories() {
  // const { authUser } = useAuth()
  return (
    <div className="w-[35vw] relative">
      <div className="absolute left-[110%] top-6">
        <Account />
      </div>
      {/* <div className="flex gap-x-4 overflow-x-auto max-w-full  py-6 px-4">
        <div className="relative">
          <Avatar
            className="w-14 h-14 border-3 border-black"
            src={authUser?.avatarUrl}
          />
          <div className="absolute bottom-0 right-1 rounded-full bg-black p-[2px] flex items-center justify-center">
            <BsPlusCircleFill className="text-white text-lg" />
          </div>
        </div>
      </div> */}
    </div>
  )
}
