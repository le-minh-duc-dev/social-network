import React from "react"
import { Post, User as UserType } from "@/types/schema"
import Comment from "../fullPostModal/Comment"
import Like from "../Like"
import CommentForm from "../CommentForm"
import { Formater } from "@/lib/Formater"
import CommentList from "../fullPostModal/CommentList"
import PostOption from "../postOption/PostOption"
import { MdVerified } from "react-icons/md"
import Saved from "../Saved"
import {
  Drawer,
  DrawerContent,
  Button,
  useDisclosure,
  Divider,
  User,
} from "@heroui/react"
import { FaRegComment } from "react-icons/fa"

export default function MobileCommentList({
  post,
}: Readonly<{ post: Post | null }>) {
  const author: UserType = post?.author as UserType
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  if (!post) return null
  return (
    <>
      <Button isIconOnly variant="light" onPress={onOpen}>
        <FaRegComment className="text-2xl -scale-x-100" />
      </Button>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="bottom" classNames={{
        base:"max-h-screen w-full md:w-[90vw] left-1/2 -translate-x-1/2 ",
      }}>
        <DrawerContent>
          {() => (
            <div className="p-4 flex flex-col h-[75vh] overflow-hidden ">
              <div className="flex justify-between items-center mt-2 mr-2">
                <User
                  avatarProps={{
                    src: author.avatarUrl,
                    size: "sm",
                  }}
                  name={
                    <div className="flex items-center">
                      {author.username ?? author.fullName}
                      {author.isVerified && (
                        <MdVerified className="text-blue-500 inline-block ml-1" />
                      )}
                    </div>
                  }
                />
                <PostOption post={post} hiddenItems={["goToPost"]} />
              </div>
              <Divider className="my-4" />
              <div className="flex flex-col flex-1  overflow-hidden">
                {post.caption && (
                  <Comment
                    name={author.username ?? author.fullName}
                    content={post.caption}
                    isComment={false}
                    avatarUrl={author.avatarUrl}
                    createdAt={post.createdAt}
                    isVerified={author.isVerified}
                  />
                )}

                <CommentList postId={post._id.toString()} />

                <Divider className="my-3" />
                <div className="">
                  <div className="flex justify-between mt-2">
                    <Like postId={post._id.toString()} />
                    <Saved postId={post._id.toString()} />
                  </div>
                  <div className="text-xs text-default-500 ml-2 mt-3">
                    {Formater.formatFullTimeAgo(post.createdAt)}
                  </div>
                </div>
                <Divider className="my-3" />
                <div className="pb-4">
                  <CommentForm postId={post._id.toString()} />
                </div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </>
  )
}
