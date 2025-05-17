import { Post, User as UserType } from "@/types/schema"
import { Divider, User } from "@heroui/react"
import React from "react"
import { MdVerified } from "react-icons/md"
import PostOption from "../postOption/PostOption"
import Comment from "../fullPostModal/Comment"
import CommentForm from "../CommentForm"
import RealCommentList from "../fullPostModal/CommentList"

export default function CommentList({ post }: Readonly<{ post: Post }>) {
  const author = post?.author as UserType

  return (
    <div className="h-full px-4 flex flex-col overflow-hidden">
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
        <PostOption post={post} />
      </div>
      <Divider className="my-4" />
      <div className="flex flex-col flex-1  overflow-hidden">
        {post.caption && (
          <Comment
            name={author.username??author.fullName}
            content={post.caption}
            isComment={false}
            avatarUrl={author.avatarUrl}
            createdAt={post.createdAt}
            isVerified={author.isVerified}
          />
        )}

        <RealCommentList postId={post._id.toString()} />

        <Divider className="my-3" />
        <div className="pb-4">
          <CommentForm postId={post._id.toString()} />
        </div>
      </div>
    </div>
  )
}
