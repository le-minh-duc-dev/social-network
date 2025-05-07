import { useAuth } from "@/hooks/useAuth"
import { Avatar } from "@heroui/react"
import React from "react"

export default function UserIcon() {
  const { authUser } = useAuth()
  console.log(authUser);
  return <Avatar size="sm" src={authUser?.avatarUrl} />
}
