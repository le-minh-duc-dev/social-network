import React from "react"
import { Listbox, ListboxItem } from "@heroui/react"
import { FaRegUserCircle } from "react-icons/fa"
import { IoLockClosedOutline } from "react-icons/io5"
import { AppRouteManager } from "@/service/AppRouteManager"
import { usePathname } from "next/navigation"
export default function LinkList() {
  const pathname = usePathname()
  const items = [
    {
      key: "edit_profile",
      label: "Edit profile",
      icon: <FaRegUserCircle className="text-2xl" />,
      link: AppRouteManager.USER_SETTINGS_EDIT_PROFILE,
    },
    {
      key: "privacy",
      label: "Account privacy",
      icon: <IoLockClosedOutline className="text-2xl" />,
      link: AppRouteManager.USER_SETTINGS_PRIVACY,
    },
  ]

  function isActive(key: string) {
    if (pathname.startsWith(AppRouteManager.USER_SETTINGS_EDIT_PROFILE)) {
      return key == "edit_profile"
    } else if (pathname.startsWith(AppRouteManager.USER_SETTINGS_PRIVACY)) {
      return key == "privacy"
    }
    return false
  }
  return (
    <Listbox aria-label="Dynamic Actions" items={items}>
      {(item) => (
        <ListboxItem
          key={item.key}
          startContent={item.icon}
          classNames={{ base: `p-4 ${isActive(item.key)?"bg-neutral-800":""}` }}
          href={item.link}
        >
          {item.label}
        </ListboxItem>
      )}
    </Listbox>
  )
}
