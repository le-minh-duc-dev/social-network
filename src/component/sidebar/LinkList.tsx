"use client"
import { AppRouteManager } from "@/service/AppRouteManager"
import { Button, Skeleton } from "@heroui/react"
import React, { ReactNode } from "react"
import { GoHome, GoHomeFill } from "react-icons/go"
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io"
import {
  IoAddCircleOutline,
  IoSearchOutline,
  IoSearchSharp,
} from "react-icons/io5"
import { PiFilmReel, PiFilmReelFill } from "react-icons/pi"
import UserIcon from "./UserIcon"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/component/provider/auth/AuthContext"
import { MdExplore, MdOutlineExplore } from "react-icons/md"
import NotificationIcon from "./NotificationIcon"

interface ItemType {
  type: "link" | "action"
  url: string
  label: string
  defaultIcon: ReactNode
  activeIcon: ReactNode
}
export default function LinkList({
  isSearchOpen,
  setIsSearchOpen,
  isNotificationPanelOpen,
  setIsNotificationPanelOpen,
}: Readonly<{
  isSearchOpen: boolean
  isNotificationPanelOpen: boolean
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsNotificationPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
}>) {
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
      url: "",
      label: "Search",
      defaultIcon: <IoSearchOutline className="text-2xl" />,
      activeIcon: <IoSearchSharp className="text-2xl" />,
    },
    {
      type: "link",
      url: AppRouteManager.EXPLORE,
      label: "Explore",
      defaultIcon: <MdOutlineExplore className="text-2xl" />,
      activeIcon: <MdExplore className="text-2xl" />,
    },
    {
      type: "link",
      url: AppRouteManager.REELS,
      label: "Reels",
      defaultIcon: <PiFilmReel className="text-2xl" />,
      activeIcon: <PiFilmReelFill className="text-2xl" />,
    },
    {
      type: "action",
      url: "",
      label: "Notifications",
      defaultIcon: (
        <NotificationIcon>
          <IoIosHeartEmpty className="text-2xl" />
        </NotificationIcon>
      ),
      activeIcon: (
        <NotificationIcon>
          <IoMdHeart className="text-2xl" />
        </NotificationIcon>
      ),
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

  const isActionActive = (item: ItemType): boolean => {
    if (item.type == "action") {
      if (item.label == "Search") return isSearchOpen
      if (item.label == "Notifications") return isNotificationPanelOpen
    }
    return false
  }

  if (isLoading)
    return (
      <div className="flex flex-col w-full items-center gap-y-6">
        {items.map((item) => (
          <div className="w-full" key={item.label}>
            <Skeleton className="w-36 h-8 rounded-xl"></Skeleton>
          </div>
        ))}
      </div>
    )

  if (!authUser?.isActive) return <div></div>
  return (
    <div className="flex flex-col w-full items-center gap-y-6">
      {items.map((item) => (
        <Button
          key={item.label}
          startContent={
            (item.type == "link" && isPathNameMatched(item.url)) ||
            isActionActive(item)
              ? item.activeIcon
              : item.defaultIcon
          }
          variant="light"
          className={`text-base ${
            isPathNameMatched(item.url) ? "font-semibold" : ""
          } w-full lg:justify-start justify-center`}
          onPress={() => {
            if (item?.type == "action") {
              switch (item.label) {
                case "Search":
                  setIsSearchOpen((prev) => !prev)
                  break
                case "Notifications":
                  setIsNotificationPanelOpen((prev) => !prev)
                  break
              }
            } else {
              router.push(item.url)
            }
          }}
        >
          <div className="lg:block hidden">{item.label}</div>
        </Button>
      ))}
    </div>
  )
}
