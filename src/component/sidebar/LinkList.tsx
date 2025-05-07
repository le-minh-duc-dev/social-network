"use client"
import { AppRoute } from "@/domain/enums/AppRoute"
import { Listbox, ListboxItem } from "@heroui/react"
import React from "react"
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

export default function LinkList() {
  const pathname = usePathname()
  const items = [
    {
      url: AppRoute.HOME,
      label: "Home",
      defaultIcon: <GoHome className="text-2xl" />,
      activeIcon: <GoHomeFill className="text-2xl" />,
    },
    {
      url: AppRoute.SEARCH,
      label: "Search",
      defaultIcon: <IoSearchOutline className="text-2xl" />,
      activeIcon: <IoSearchSharp className="text-2xl" />,
    },
    {
      url: AppRoute.REEL,
      label: "Reels",
      defaultIcon: <PiFilmReel className="text-2xl" />,
      activeIcon: <PiFilmReelFill className="text-2xl" />,
    },
    {
      url: AppRoute.NOTIFICATION,
      label: "Notifications",
      defaultIcon: <IoIosHeartEmpty className="text-2xl" />,
      activeIcon: <IoMdHeart className="text-2xl" />,
    },

    {
      url: AppRoute.CREATE,
      label: "Create",
      defaultIcon: <IoAddCircleOutline className="text-2xl" />,
      activeIcon: <IoAddCircleOutline className="text-2xl" />,
    },

    {
      url: AppRoute.PROFILE,
      label: "Profile",
      defaultIcon: <UserIcon />,
      activeIcon: <UserIcon />,
    },
  ]

  const isPathNameMatched = (url: string): boolean => {
    if (url == "/") return pathname == url
    return pathname.startsWith(url)
  }

  return (
    <Listbox aria-label="Dynamic Actions" items={items}>
      {(item) => (
        <ListboxItem
          key={item.url}
          href={item.url}
          startContent={
            isPathNameMatched(item.url) ? item.activeIcon : item.defaultIcon
          }
          classNames={{
            title: `text-base ${isPathNameMatched(item.url) ? "font-semibold" : ""}`,
            base: "mt-4",
          }}
        >
          {item.label}
        </ListboxItem>
      )}
    </Listbox>
  )
}
