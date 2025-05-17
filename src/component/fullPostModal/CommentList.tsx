import { QueryKey, QueryStaleTime } from "@/domain/enums/QueryKey"
import { CommentAPI } from "@/service/CommentAPI"
import { Comment as CommentType, User } from "@/types/schema"
import Comment from "./Comment"
import { InfiniteVirtualList } from "../InfiniteVirtualList"

export default function CommentList({ postId }: Readonly<{ postId: string }>) {
  return (
    <InfiniteVirtualList<CommentType>
      queryKey={[QueryKey.GET_POST_COMMENTS,postId]}
      fetchFn={async (pageParam: string) => {
        return await CommentAPI.getComments(postId, pageParam)
      }}
      renderItem={(comment) => (
        <div className="py-2">
          <Comment
            name={(comment.author as User)?.fullName ?? ""}
            avatarUrl={(comment.author as User)?.avatarUrl}
            createdAt={comment.createdAt}
            content={comment.content}
            isVerified={(comment.author as User)?.isVerified}
          />
        </div>
      )}
      Skeleton={() => <div>seleton</div>}
      staleTime={QueryStaleTime[QueryKey.GET_POST_COMMENTS]}
    />
  )
}
