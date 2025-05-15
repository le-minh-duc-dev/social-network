"use client"
import { AppRouteManager } from "@/service/AppRouteManager"
import { Listbox, ListboxItem, useDisclosure } from "@heroui/react"
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
import { useAuth } from "@/hooks/useAuth"
import { MdExplore, MdOutlineExplore } from "react-icons/md"

export default function LinkList() {
  const pathname = usePathname()
  const { authUser } = useAuth()
  const items: {
    type: "link" | "action"
    url: string
    label: string
    defaultIcon: ReactNode
    activeIcon: ReactNode
  }[] = [
    {
      type: "link",
      url: AppRouteManager.HOME,
      label: "Home",
      defaultIcon: <GoHome className="text-2xl" />,
      activeIcon: <GoHomeFill className="text-2xl" />,
    },
    {
      type: "link",
      url: AppRouteManager.SEARCH,
      label: "Search",
      defaultIcon: <IoSearchOutline className="text-2xl" />,
      activeIcon: <IoSearchSharp className="text-2xl" />,
    },
     {
      type: "link",
      url: AppRouteManager.EXPLORE,
      label: "Explore",
      defaultIcon: <MdOutlineExplore  className="text-2xl" />,
      activeIcon: <MdExplore  className="text-2xl" />,
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
      url: AppRouteManager.NOTIFICATION,
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
      url: AppRouteManager.PROFILE + "?userId=" + authUser?.id,
      label: "Profile",
      defaultIcon: <UserIcon />,
      activeIcon: <UserIcon />,
    },
  ]

  const isPathNameMatched = (url: string): boolean => {
    if (url == "/") return pathname == url
    return pathname.startsWith(url)
  }

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  if (!authUser?.isActive) return <div></div>
  return (
    <div>
      <Create isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
      <Listbox
        aria-label="Dynamic Actions"
        items={items}
        onAction={(key) => {
          const item = items.find((item) => item.label == key)
          if (item?.type == "action" && item.label == "Create") {
            onOpen()
          }
        }}
      >
        {(item) => (
          <ListboxItem
            key={item.label}
            href={item.type == "link" ? item.url : undefined}
            startContent={
              isPathNameMatched(item.url) ? item.activeIcon : item.defaultIcon
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
