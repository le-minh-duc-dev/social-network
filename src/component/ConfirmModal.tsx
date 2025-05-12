import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react"
import { ReactNode } from "react"

export default function ConfirmModal({
  isOpen,
  onOpenChange,
  title = "Warning",
  message,
  action,
  actionName = "Ok",
  isLoading = false,
}: Readonly<{
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  title?: ReactNode
  message: ReactNode
  action: () => void
  actionName?: string
  isLoading?: boolean
}>) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{message}</ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                isDisabled={isLoading}
                onPress={action}
              >
                {actionName}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
