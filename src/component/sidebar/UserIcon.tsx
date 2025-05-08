import { useAuth } from "@/hooks/useAuth"
import { Avatar } from "@heroui/react"
import React from "react"

export default function UserIcon() {
  const { authUser } = useAuth()
  return <Avatar className="w-6 h-6" src={authUser?.avatarUrl} />
}
