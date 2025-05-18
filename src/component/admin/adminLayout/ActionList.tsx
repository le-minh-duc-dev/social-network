import { AppRouteManager } from "@/service/AppRouteManager"
import { Listbox, ListboxItem, ListboxSection } from "@heroui/react"
import { usePathname } from "next/navigation"
import { FaUsers } from "react-icons/fa"
import { RxDashboard } from "react-icons/rx"
export default function ActionList() {
  const pathname = usePathname()

  const isPathNameMatched = (url: string): boolean => {
    return pathname=== url
  }

  return (
    <div>
      <Listbox
        aria-label="Dynamic Actions"

        //   onAction={(key) => {
        //     const item = items.find((item) => item.label == key)
        //   }}
      >
        <ListboxSection title="Home">
          <ListboxItem
            href={AppRouteManager.ADMIN}
            startContent={<RxDashboard className="text-2xl" />}
            classNames={{
              title: `text-base ${
                isPathNameMatched(AppRouteManager.ADMIN) ? "font-bold" : ""
              }`,
              base: `mt-4 ${isPathNameMatched(AppRouteManager.ADMIN) ? "bg-white/15" : ""}`,
            }}
          >
            Dashboard
          </ListboxItem>
        </ListboxSection>
        <ListboxSection title="Users">
          <ListboxItem
            href={AppRouteManager.ADMIN_MANAGE_USERS}
            startContent={<FaUsers className="text-2xl" />}
            classNames={{
              title: `text-base ${
                isPathNameMatched(AppRouteManager.ADMIN_MANAGE_USERS)
                  ? "font-semibold"
                  : ""
              }`,
              base: `mt-4 ${isPathNameMatched(AppRouteManager.ADMIN_MANAGE_USERS) ? "bg-white/15" : ""}`,
            }}
          >
            Manage Users
          </ListboxItem>
        </ListboxSection>
      </Listbox>
    </div>
  )
}
