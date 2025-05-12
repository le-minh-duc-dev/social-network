import { Formater } from "@/lib/Formater"
import { Post as PostType, User as UserType } from "@/types/schema"
import { Button, Divider, User } from "@heroui/react"
import React from "react"
import MediaCarousel from "../MediaCarousel"
import { FaRegBookmark, FaRegComment } from "react-icons/fa"
import CommentForm from "../CommentForm"
import { LuDot } from "react-icons/lu"
import Like from "../Like"
import { useFullPostModal } from "@/context/FullPostContext"
import PostOption from "../PostOption"

export default function Post({ post }: Readonly<{ post: PostType }>) {
  const author: UserType = post.author as UserType
  const { setPost } = useFullPostModal()

  return (
    <div className=" border-b border-white/25 pb-3 ">
      <div className="flex justify-between items-center">
        <User
          avatarProps={{
            src: author.avatarUrl,
          }}
          name={
            <div className="flex items-center gap-x-1">
              <p className="font-semibold">{author.fullName}</p>
              <LuDot className="text-lg text-default-400" />
              <p className="text-default-400">
                {Formater.formatTimeAgo(post.createdAt)}
              </p>
            </div>
          }
        />
        <PostOption />
      </div>
      {post.media.length > 0 ? (
        <div className=" overflow-hidden mt-4 rounded-lg border border-white/25">
          <div className="">
            <MediaCarousel mediaList={post.media} />
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-sm ">
            <span className="font-bold">{author.fullName}</span> {post.caption}
          </p>
          <Divider className="my-4" />
        </div>
      )}
      <div className="flex justify-between mt-2">
        <div className="flex ">
          <Like postId={post._id.toString()} />
          <Button isIconOnly variant="light" onPress={() => setPost(post)}>
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
      {post.media.length > 0 && (
        <div className="">
          <p className="text-sm ">
            <span className="font-bold">{author.fullName}</span> {post.caption}
          </p>
        </div>
      )}
      {post.commentCount > 0 && (
        <div className="mt-2">
          <button
            className="text-sm text-gray-500"
            onClick={() => setPost(post)}
          >
            View {post.commentCount > 1 ? "all" : ""} {post.commentCount}{" "}
            {post.commentCount > 1 ? "comments" : "comment"}
          </button>
        </div>
      )}
      <div className="my-2 ">
        <CommentForm postId={post._id.toString()} />
      </div>
    </div>
  )
}
