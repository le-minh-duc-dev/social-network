import { createLike } from "@/actions/like/createLike"
import { deleteLike } from "@/actions/like/deleteLike"
import { HttpMessages, HttpStatus } from "@/domain/enums/HttpStatus"
import { QueryKey, QueryStaleTime } from "@/domain/enums/QueryKey"
import { useAuth } from "@/hooks/useAuth"
import { LikeAPI } from "@/service/LikeAPI"
import { addToast, Button } from "@heroui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { FaHeart, FaRegHeart } from "react-icons/fa"

export default function Like({ postId }: Readonly<{ postId: string }>) {
  const { authUser } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryFn: () => LikeAPI.checkLikeExists(postId),
    queryKey: [QueryKey.GET_POST_LIKES, postId, authUser?._id],
    staleTime: QueryStaleTime[QueryKey.GET_POST_LIKES],
  })

  useEffect(() => {
    if (data) {
      setIsLiked(data.exists)
    }
  }, [data])

  const toggleLike = async () => {
    if (isLiked) {
      setIsLiked(false)
      return await deleteLike(postId)
    } else {
      setIsLiked(true)
      return await createLike(postId)
    }
  }

  const mutation = useMutation({
    mutationFn: toggleLike,
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
        queryKey: [QueryKey.GET_POST_LIKES],
        exact: false,
      })
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_POST, postId],
      })
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_POSTS],
        exact: false,
      })
    },
    onError: () => {
      setIsLiked(!isLiked)
      addToast({
        title: HttpMessages[HttpStatus.INTERNAL_SERVER_ERROR],
      })
    },
  })

  return (
    <Button
      isIconOnly
      variant="light"
      onPress={() => mutation.mutate()}
      isDisabled={mutation.isPending}
    >
      {isLiked ? (
        <FaHeart className="text-2xl text-red-500" />
      ) : (
        <FaRegHeart className="text-2xl" />
      )}
    </Button>
  )
}
