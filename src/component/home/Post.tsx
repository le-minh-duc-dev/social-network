import { Formater } from "@/lib/Formater"
import { Post as PostType, User as UserType } from "@/types/schema"
import { Button, User } from "@heroui/react"
import React from "react"
import { IoIosMore } from "react-icons/io"
import MediaCarousel from "./MediaCarousel"
import { FaRegBookmark, FaRegComment, FaRegHeart } from "react-icons/fa"
import CommentForm from "./CommentForm"
import { LuDot } from "react-icons/lu"

export default function Post({ post }: { post: PostType }) {
  const author: UserType = post.author as UserType
  return (
    <div className=" border-b border-white/25 pb-3">
      <div className="flex justify-between items-center">
        <User
          avatarProps={{
            src: author.avatarUrl,
          }}
          name={
            <div className="flex items-center gap-x-1">
              <p>{author.fullName}</p>
              <LuDot className="text-lg text-default-400"/>
              <p className="text-default-400">{Formater.formatTimeAgo(post.createdAt)}</p>
            </div>
          }
        />
        <Button isIconOnly variant="light">
          <IoIosMore className="text-xl" />
        </Button>
      </div>
      <div className=" overflow-hidden mt-4 rounded-lg border border-white/25">
        <div className="">
          <MediaCarousel mediaList={post.media} />
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <div className="flex ">
          <Button isIconOnly variant="light">
            <FaRegHeart className="text-2xl" />
          </Button>
          <Button isIconOnly variant="light">
            <FaRegComment className="text-2xl -scale-x-100" />
          </Button>
        </div>
        <Button isIconOnly variant="light">
          <FaRegBookmark className="text-xl" />
        </Button>
      </div>
      <div className="my-2">
        <p className="text-sm font-semibold">
          {post.likeCount} {post.likeCount > 1 ? "likes" : "like"}
        </p>
      </div>
      <div className="">
        <p className="text-sm ">
          <span className="font-bold">{author.fullName}</span> {post.caption}
        </p>
      </div>
      {post.commentCount > 1 && (
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            View {post.commentCount > 1 ? "all" : ""} {post.commentCount}{" "}
            {post.commentCount > 1 ? "comments" : "comment"}
          </p>
        </div>
      )}
      <div className="my-2 ">
        <CommentForm postId={post._id.toString()} />
      </div>
    </div>
  )
}
