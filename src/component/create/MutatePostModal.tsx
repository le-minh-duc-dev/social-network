import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  User,
} from "@heroui/react"
import DropZone from "./DropZone"
import { useAuth } from "@/hooks/useAuth"
import { useMutatePostContext } from "./MutatePostContext"
export default function MutatePostModal({
  title,
  submitButtonName,
  isOpen,
  onOpenChange,
}: Readonly<{title:string, submitButtonName:string, isOpen: boolean; onOpenChange: (isOpen: boolean) => void }>) {
  const { authUser } = useAuth()
  const { captionRef, handleSubmit, isPending } = useMutatePostContext()
  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const caption = e.target.value
    captionRef.current = caption
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="4xl"
      classNames={{
        header: "border-b-[1px] border-white/10 text-base py-2 ",
        body: "grid grid-cols-5   p-0    overflow-y-hidden",
        base: "bg-black border border-white/10 h-[75vh] ",
      }}
      hideCloseButton={true}
      shouldBlockScroll={false}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-between items-center">
              <Button variant="light" color="danger" onPress={onClose}>
                Cancel
              </Button>
              <div className="">{title}</div>
              <Button
                variant="light"
                color="primary"
                onPress={handleSubmit}
                isLoading={isPending}
              >
                {submitButtonName}
              </Button>
            </ModalHeader>
            <ModalBody>
              <div className="col-span-3 h-full overflow-hidden">
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
                    onChange={handleCaptionChange}
                    maxLength={2200}
                  />
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
