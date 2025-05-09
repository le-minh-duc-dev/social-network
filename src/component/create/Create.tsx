import { useAuth } from "@/hooks/useAuth"
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  User,
} from "@heroui/react"
import React from "react"
import DropZone from "./DropZone"

export default function Create({
  isOpen,
  onOpenChange,
}: Readonly<{ isOpen: boolean; onOpenChange: (isOpen: boolean) => void }>) {
  const { authUser } = useAuth()
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="4xl"
        classNames={{
          header: "border-b-[1px] border-white/10 text-base py-2 ",
          body: "grid grid-cols-5   p-0    overflow-y-hidden",
          base: "bg-black border border-white/10 h-[75vh] " ,
        }}
        hideCloseButton={true}
        shouldBlockScroll={false}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex justify-between items-center">
                <div className=""></div>
                <div className="">Create new post</div>
                <Button variant="light" color="primary">
                  Share
                </Button>
              </ModalHeader>
              <ModalBody>
                <div className="col-span-3 ">
                  <DropZone />
                </div>
                <div className="col-span-2 p-3 bg-neutral-800">
                  <div className="">
                    <User
                      avatarProps={{
                        src: authUser?.avatarUrl,
                        size: "sm",
                      }}
                      //   description="Product Designer"
                      name={authUser?.name}
                    />
                    <textarea
                      className="mt-4 w-full text-sm h-40 bg-transparent border-none outline-none resize-none"
                      placeholder="Write something..."
                      rows={4}
                    />
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
