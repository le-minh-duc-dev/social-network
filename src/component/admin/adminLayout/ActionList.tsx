import { AppRouteManager } from "@/service/AppRouteManager"
import {
  Listbox,
  ListboxItem,
  ListboxSection,
} from "@heroui/react"
import { usePathname } from "next/navigation"
import { FaUsers } from "react-icons/fa"
import { RxDashboard } from "react-icons/rx"
export default function ActionList() {
  const pathname = usePathname()

  const isPathNameMatched = (url: string): boolean => {
    if (url == "/") return pathname == url
    return pathname.startsWith(url)
  }

  return (
    <div>
      <Listbox
        aria-label="Dynamic Actions"

        //   onAction={(key) => {
        //     const item = items.find((item) => item.label == key)
        //   }}
      >
        <ListboxSection  title="Home">
          <ListboxItem
            href={AppRouteManager.ADMIN}
            startContent={<RxDashboard className="text-2xl" />}
            classNames={{
              title: `text-base ${
                isPathNameMatched(AppRouteManager.ADMIN) ? "font-semibold" : ""
              }`,
              base: "mt-4",
            }}
          >
            Dashboard
          </ListboxItem>
        </ListboxSection>
        <ListboxSection  title="Users">
          <ListboxItem
            href={AppRouteManager.ADMIN_MANAGE_USERS}
            startContent={<FaUsers className="text-2xl" />}
            classNames={{
              title: `text-base ${
                isPathNameMatched(AppRouteManager.ADMIN_MANAGE_USERS)
                  ? "font-semibold"
                  : ""
              }`,
              base: "mt-4",
            }}
          >
            Manage Users
          </ListboxItem>
        </ListboxSection>
      </Listbox>
    </div>
  )
}
