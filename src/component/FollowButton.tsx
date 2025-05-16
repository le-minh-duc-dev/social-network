import { createFollow } from "@/actions/follow/createFollow"
import { deleteFollow } from "@/actions/follow/deleteFollow"
import { HttpMessages, HttpStatus } from "@/domain/enums/HttpStatus"
import { QueryKey, QueryStaleTime } from "@/domain/enums/QueryKey"
import { useAuth } from "@/component/provider/auth/AuthContext"
import { FollowAPI } from "@/service/api/FollowAPI"
import { FollowStatus } from "@/types/schema"
import { addToast, Button, ButtonProps } from "@heroui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { IoMdPersonAdd } from "react-icons/io"

export default function FollowButton({
  followingId,
  onChangeCallback,
  className,
  ...props
}: Readonly<
  {
    onChangeCallback?: (followStatus: FollowStatus) => void
    followingId: string
    className?: string
  } & ButtonProps
>) {
  const { authUser } = useAuth()
  const [followStatus, setFollowStatus] = useState<FollowStatus>("notFollowing")
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryFn: () => FollowAPI.getFollowStatus(followingId),
    queryKey: [QueryKey.GET_USER_FOLLOW, followingId, authUser?.id],
    staleTime: QueryStaleTime[QueryKey.GET_USER_FOLLOW],
  })

  useEffect(() => {
    if (data) {
      setFollowStatus(data.status)
      if (onChangeCallback) {
        onChangeCallback(data.status)
      }
    }
  }, [data, onChangeCallback])

  const toggleSaved = async () => {
    if (followStatus === "following" || followStatus === "requesting") {
      setFollowStatus("notFollowing")
      if (onChangeCallback) {
        onChangeCallback("notFollowing")
      }
      return await deleteFollow(followingId)
    } else {
      setFollowStatus("requesting")
      if (onChangeCallback) {
        onChangeCallback("requesting")
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
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_USERS, followingId],
        exact: false,
      })
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_POSTS],
        exact: false,
      })
      if (response.status == HttpStatus.CREATED) {
        addToast({
          title: "Request follow successfully",
        })
      }
      if (response.status == HttpStatus.NO_CONTENT) {
        addToast({
          title: "Unfollow successfully",
        })
      }
    },
    onError: () => {
      if (followStatus === "requesting" || followStatus === "following") {
        setFollowStatus("notFollowing")
        if (onChangeCallback) {
          onChangeCallback("notFollowing")
        }
      } else {
        setFollowStatus("requesting")
        if (onChangeCallback) {
          onChangeCallback("requesting")
        }
      }
      addToast({
        title: HttpMessages[HttpStatus.INTERNAL_SERVER_ERROR],
      })
    },
  })

  let buttonText = "Follow"
  if (followStatus == "requesting") {
    buttonText = "Requesting"
  } else if (followStatus == "following") {
    buttonText = "Following"
  }

  return (
    <Button
      className={className}
      color={
        followStatus == "following" || followStatus == "requesting"
          ? "default"
          : "primary"
      }
      onPress={() => mutation.mutate()}
      isDisabled={mutation.isPending}
      startContent={
        followStatus == "following" ||
        followStatus == "requesting" ? undefined : (
          <IoMdPersonAdd />
        )
      }
      {...props}
    >
      {buttonText}
    </Button>
  )
}
