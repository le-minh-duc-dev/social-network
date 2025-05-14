import { createFollow } from "@/actions/follow/createFollow"
import { deleteFollow } from "@/actions/follow/deleteFollow"
import { HttpMessages, HttpStatus } from "@/domain/enums/HttpStatus"
import { QueryKey, QueryStaleTime } from "@/domain/enums/QueryKey"
import { useAuth } from "@/hooks/useAuth"
import { FollowAPI } from "@/service/api/FollowAPI"
import { addToast, Button } from "@heroui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { IoMdPersonAdd } from "react-icons/io"

export default function FollowButton({
  followingId,
  onChangeCallback,
  className,
}: Readonly<{
  onChangeCallback?: (isFollowing: boolean) => void
  followingId: string
  className?: string
}>) {
  const { authUser } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryFn: () => FollowAPI.checkFollowExists(followingId),
    queryKey: [QueryKey.GET_USER_FOLLOW, followingId, authUser?.id],
    staleTime: QueryStaleTime[QueryKey.GET_USER_FOLLOW],
  })

  useEffect(() => {
    if (data) {
      setIsFollowing(data.exists)
      if (onChangeCallback) {
        onChangeCallback(data.exists)
      }
    }
  }, [data, onChangeCallback])

  const toggleSaved = async () => {
    if (isFollowing) {
      setIsFollowing(false)
      if (onChangeCallback) {
        onChangeCallback(false)
      }
      return await deleteFollow(followingId)
    } else {
      setIsFollowing(true)
      if (onChangeCallback) {
        onChangeCallback(true)
      }
      return await createFollow(followingId)
    }
  }

  const mutation = useMutation({
    mutationFn: toggleSaved,
    onSuccess: (response) => {
      if (
        response.status != HttpStatus.CREATED &&
        response.status != HttpStatus.NO_CONTENT
      ) {
        addToast({
          title: response.errors
            ? response.errors[0]
            : HttpMessages[HttpStatus.INTERNAL_SERVER_ERROR],
        })
        return
      }
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_USER_FOLLOW],
        exact: false,
      })
      if (response.status == HttpStatus.CREATED) {
        addToast({
          title: "Follow successfully",
        })
      }
      if (response.status == HttpStatus.NO_CONTENT) {
        addToast({
          title: "Unfollow successfully",
        })
      }
    },
    onError: () => {
      setIsFollowing(!isFollowing)
      if (onChangeCallback) {
        onChangeCallback(!isFollowing)
      }
      addToast({
        title: HttpMessages[HttpStatus.INTERNAL_SERVER_ERROR],
      })
    },
  })

  return (
    <Button
      className={className}
      color={isFollowing ? "default" : "primary"}
      onPress={() => mutation.mutate()}
      isDisabled={mutation.isPending}
      startContent={isFollowing ? undefined : <IoMdPersonAdd />}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  )
}
