"use client"
import {
  SimpleModalContext,
  SimpleModalContextType,
} from "@/context/SimpleModalContext"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react"
import { ReactNode, useMemo, useState } from "react"

export default function SimpleModalProvider({
  children,
}: {
  children: ReactNode
}) {
  const [title, setTitle] = useState("Info")
  const [content, setContent] = useState("")
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const contextValue = useMemo<SimpleModalContextType>(
    () => ({
      isOpen,
      onOpen,
      setTitle,
      setContent,
    }),
    [title, content, isOpen, onOpen]
  )
  return (
    <SimpleModalContext.Provider value={contextValue}>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
          <ModalBody className="py-6">{content}</ModalBody>
        </ModalContent>
      </Modal>
      {children}
    </SimpleModalContext.Provider>
  )
}
