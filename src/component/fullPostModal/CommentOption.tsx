import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
} from "@heroui/react"
import { FaRegTrashAlt } from "react-icons/fa"
import { IoIosMore } from "react-icons/io"
import { User } from "@/types/schema"
import DeleteComment from "./DeleteComment"
import { useAuth } from "../provider/auth/AuthContext"

export default function CommentOption({
  commentId,
  postId,
  author,
}: Readonly<{ author: User; commentId: string; postId: string }>) {
  const { authUser } = useAuth()

  const isCommentAuthor = authUser?.id == author._id.toString()

  const {
    isOpen: isDeletePostOpen,
    onOpen: onDeletePostOpen,
    onOpenChange: onDeletePostOpenChange,
    onClose: onDeletePostClose,
  } = useDisclosure()

  if (!isCommentAuthor) return null
  return (
    <>
      <DeleteComment
        commentId={commentId}
        isOpen={isDeletePostOpen}
        onOpenChange={onDeletePostOpenChange}
        onClose={onDeletePostClose}
        postId={postId}
      />
      <Dropdown shouldBlockScroll={false}>
        <DropdownTrigger>
          <button>
            <IoIosMore className="text-lg" />
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            startContent={<FaRegTrashAlt />}
            onPress={onDeletePostOpen}
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  )
}
