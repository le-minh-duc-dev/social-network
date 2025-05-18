"use client"
import { ReactNode } from "react"
import ActionList from "./ActionList"
import { Button } from "@heroui/react"
import { IoMdArrowRoundBack } from "react-icons/io"
import { useRouter } from "next/navigation"
import { AppRouteManager } from "@/service/AppRouteManager"

export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const router = useRouter()
  return (
    <div className=" h-full overflow-hidden grid grid-cols-6">
      <div className="col-span-1  p-4 border-r border-white/15 relative">
        <h1 className="text-2xl font-bold  mt-4">Admin</h1>
        <ActionList />
        <Button
          variant="light"
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          startContent={<IoMdArrowRoundBack />}
          onPress={() => {
            router.push(AppRouteManager.HOME)
          }}
        >
          Back to Social Network
        </Button>
      </div>
      <div className="col-span-5">{children}</div>
    </div>
  )
}
