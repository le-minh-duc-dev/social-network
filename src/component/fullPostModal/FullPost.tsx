import React from "react"
import { Post, User as UserType } from "@/types/schema"
import MediaCarousel from "../MediaCarousel"
import { Button, Divider, User } from "@heroui/react"
import Comment from "./Comment"
import Like from "../Like"
import { FaRegBookmark } from "react-icons/fa"
import CommentForm from "../CommentForm"
import { Formater } from "@/lib/Formater"
import CommentList from "./CommentList"
import PostOption from "../PostOption"
export default function FullPost({ post }: Readonly<{ post: Post | null }>) {
  if (!post) return null
  const author: UserType = post?.author as UserType
  return (
    <div
      className={` h-[95vh] bg-black space-y-4  grid  rounded-lg overflow-hidden ${
        post.media.length > 0 ? "w-[70vw]  grid-cols-5" : "w-[35vw]  "
      }`}
    >
      {post.media.length > 0 && (
        <div className="col-span-3 overflow-hidden">
          <MediaCarousel
            mediaList={post.media}
            widthAndAspect="h-full overflow-hidden"
            itemWidthHeight="h-full w-auto overflow-hidden"
          />{" "}
        </div>
      )}

      <div className="col-span-2 px-4 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mt-2 mr-2">
          <User
            avatarProps={{
              src: author.avatarUrl,
              size: "sm",
            }}
            name={author.fullName}
          />
          <PostOption post={post} />
        </div>
        <Divider className="my-4" />
        <div className="flex flex-col flex-1  overflow-hidden">
          {post.caption && (
            <Comment
              name={author.fullName}
              content={post.caption}
              isComment={false}
              avatarUrl={author.avatarUrl}
              createdAt={post.createdAt}
            />
          )}

          <CommentList postId={post._id.toString()} />

          <Divider className="my-3" />
          <div className="">
            <div className="flex justify-between mt-2">
              <Like postId={post._id.toString()} />
              <Button isIconOnly variant="light">
                <FaRegBookmark className="text-xl" />
              </Button>
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
    </div>
  )
}
