"use client"
import { AppRouteManager } from "@/service/AppRouteManager"
import { Listbox, ListboxItem, Skeleton, useDisclosure } from "@heroui/react"
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
import { usePathname } from "next/navigation"
import Create from "../postMutation/Create"
import { useAuth } from "@/component/provider/auth/AuthContext"
import { MdExplore, MdOutlineExplore } from "react-icons/md"

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
      defaultIcon: <IoIosHeartEmpty className="text-2xl" />,
      activeIcon: <IoMdHeart className="text-2xl" />,
    },

    {
      type: "action",
      url: "",
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

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  if (isLoading)
    return (
      <Listbox aria-label="Dynamic Actions" items={items}>
        {(item) => (
          <ListboxItem
            key={item.label}
            classNames={{
              title: `text-base ${
                isPathNameMatched(item.url) ? "font-semibold" : ""
              }`,
              base: "mt-4",
            }}
          >
            <Skeleton className="w-[60%] h-8 rounded-xl" />
          </ListboxItem>
        )}
      </Listbox>
    )

  if (!authUser?.isActive) return <div></div>
  return (
    <div>
      <Create isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
      <Listbox
        aria-label="Dynamic Actions"
        items={items}
        onAction={(key) => {
          const item = items.find((item) => item.label == key)
          if (item?.type == "action") {
            switch (item.label) {
              case "Create":
                onOpen()
                break
              case "Search":
                setIsSearchOpen((prev) => !prev)
                break
              case "Notifications":
                setIsNotificationPanelOpen((prev) => !prev)
                break
            }
          }
        }}
      >
        {(item) => (
          <ListboxItem
            key={item.label}
            href={item.type == "link" ? item.url : undefined}
            startContent={
              (item.type == "link" && isPathNameMatched(item.url)) ||
              isActionActive(item)
                ? item.activeIcon
                : item.defaultIcon
            }
            classNames={{
              title: `text-base ${
                isPathNameMatched(item.url) ? "font-semibold" : ""
              }`,
              base: "mt-4",
            }}
          >
            {item.label}
          </ListboxItem>
        )}
      </Listbox>
    </div>
  )
}
