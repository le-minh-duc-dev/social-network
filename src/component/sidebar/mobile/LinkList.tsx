"use client"
import { AppRouteManager } from "@/service/AppRouteManager"
import { Button } from "@heroui/react"
import React, { ReactNode } from "react"
import { GoHome, GoHomeFill } from "react-icons/go"
import {
  IoAddCircleOutline,
  IoSearchOutline,
  IoSearchSharp,
} from "react-icons/io5"
import { PiFilmReel, PiFilmReelFill } from "react-icons/pi"
import UserIcon from "../UserIcon"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/component/provider/auth/AuthContext"

interface ItemType {
  type: "link" | "action"
  url: string
  label: string
  defaultIcon: ReactNode
  activeIcon: ReactNode
}
export default function LinkList() {
  const pathname = usePathname()
  const { authUser, isLoading } = useAuth()
  const router = useRouter()
  const items: ItemType[] = [
    {
      type: "link",
      url: AppRouteManager.HOME,
      label: "Home",
      defaultIcon: <GoHome className="text-2xl" />,
      activeIcon: <GoHomeFill className="text-2xl" />,
    },
    {
      type: "action",
      url: AppRouteManager.EXPLORE,
      label: "Search",
      defaultIcon: <IoSearchOutline className="text-2xl" />,
      activeIcon: <IoSearchSharp className="text-2xl" />,
    },

    {
      type: "link",
      url: AppRouteManager.REELS,
      label: "Reels",
      defaultIcon: <PiFilmReel className="text-2xl" />,
      activeIcon: <PiFilmReelFill className="text-2xl" />,
    },

    {
      type: "link",
      url: AppRouteManager.CREATE,
      label: "Create",
      defaultIcon: <IoAddCircleOutline className="text-2xl" />,
      activeIcon: <IoAddCircleOutline className="text-2xl" />,
    },

    {
      type: "link",
      url: AppRouteManager.profile(authUser?.id ?? ""),
      label: "Profile",
      defaultIcon: <UserIcon />,
      activeIcon: <UserIcon />,
    },
  ]

  const isPathNameMatched = (url: string): boolean => {
    if (url == "/") return pathname == url
    return pathname.startsWith(url)
  }

  if (isLoading)
    return (
      <div className="flex justify-between">
        {items.map((item) => (
          <Button
            isIconOnly
            variant="light"
            key={item.label}
            onPress={() => router.push(item.url)}
            startContent={
              isPathNameMatched(item.url) ? item.activeIcon : item.defaultIcon
            }
            className={`text-base ${
              isPathNameMatched(item.url) ? "font-semibold" : ""
            }`}
          ></Button>
        ))}
      </div>
    )

  if (!authUser?.isActive) return <div></div>
  return (
    <div className="flex justify-between">
      {items.map((item) => (
        <Button
          isIconOnly
          variant="light"
          key={item.label}
          onPress={() => router.push(item.url)}
          startContent={
            isPathNameMatched(item.url) ? item.activeIcon : item.defaultIcon
          }
          className={`text-base ${
            isPathNameMatched(item.url) ? "font-semibold" : ""
          }`}
        ></Button>
      ))}
    </div>
  )
}
