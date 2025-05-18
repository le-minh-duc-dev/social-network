import { QueryKey, QueryStaleTime } from "@/domain/enums/QueryKey"
import { CommentAPI } from "@/service/CommentAPI"
import { Comment as CommentType, User } from "@/types/schema"
import Comment from "./Comment"
import { InfiniteVirtualList } from "../InfiniteVirtualList"
import { Skeleton } from "@heroui/react"

export default function CommentList({ postId }: Readonly<{ postId: string }>) {
  return (
    <InfiniteVirtualList<CommentType>
      queryKey={[QueryKey.GET_POST_COMMENTS, postId]}
      fetchFn={async (pageParam: string) => {
        return await CommentAPI.getComments(postId, pageParam)
      }}
      paddingEnd={20}
      renderItem={(comment) => (
        <div className="py-2">
          <Comment
            name={
              (comment.author as User)?.username ??
              (comment.author as User)?.fullName ??
              ""
            }
            avatarUrl={(comment.author as User)?.avatarUrl}
            createdAt={comment.createdAt}
            content={comment.content}
            isVerified={(comment.author as User)?.isVerified}
            author={comment.author as User}
            id={comment._id.toString()}
            postId={comment.post as string}
          />
        </div>
      )}
      Skeleton={() => (
        <div className="w-full flex flex-col gap-y-3 ">
          <div className="flex gap-x-2 w-full items-center">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 mt-1">
              <Skeleton className="h-4 w-48 rounded-lg" />
            </div>
          </div>
          <div className="flex gap-x-2 w-full items-center">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 mt-1">
              <Skeleton className="h-4 w-72 rounded-lg" />
            </div>
          </div>
          <div className="flex gap-x-2 w-full items-center">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 mt-1">
              <Skeleton className="h-4 w-60 rounded-lg" />
            </div>
          </div>
        </div>
      )}
      staleTime={QueryStaleTime[QueryKey.GET_POST_COMMENTS]}
    />
  )
}
