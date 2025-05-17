import { Button, Divider } from "@heroui/react"
import { useState } from "react"
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io"
import FollowRequestList from "./FollowRequestList"
import { useOutsideClick } from "@/hooks/useOutsideClick"
import NotificationList from "./NotificationList"

export default function NotificationPanel({
  setIsOpen,
}: Readonly<{
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}>) {
  const [isRequestFollowPanelOpen, setIsRequestFollowPanelOpen] =
    useState(false)

  const ref = useOutsideClick<HTMLDivElement>(() => setIsOpen(false))

  if (isRequestFollowPanelOpen)
    return (
      <div
        ref={ref}
        className="absolute ml-[99%] h-full flex flex-col w-96 pr-4 top-0 rounded-tr-xl rounded-br-xl border-r bg-black border-r-white/15"
      >
        <div className="flex items-center gap-x-4 mt-12">
          <Button
            isIconOnly
            variant="light"
            onPress={() => setIsRequestFollowPanelOpen(false)}
          >
            <IoMdArrowRoundBack className="text-xl" />
          </Button>
          <h2 className=" text-xl font-semibold">Follow requests</h2>
        </div>

        <div className="flex-1 flex mt-8">
          <FollowRequestList setIsOpen={setIsOpen} />
        </div>
      </div>
    )

  return (
    <div
      ref={ref}
      className="absolute ml-[99%] h-full flex flex-col w-96 pr-4 top-0 rounded-tr-xl rounded-br-xl border-r bg-black border-r-white/15"
    >
      <h2 className="mt-12 text-xl font-semibold">Notifications</h2>

      <Button
        onPress={() => setIsRequestFollowPanelOpen(true)}
        className="mt-8 w-full "
        variant="light"
      >
        <div className="flex w-full justify-between">
          <div className="">Follow request</div>
          <IoMdArrowRoundForward className="text-xl" />
        </div>
      </Button>
      <Divider className="my-4" />
      <div className="flex-1 flex mt-8">
        <NotificationList />
      </div>
    </div>
  )
}
