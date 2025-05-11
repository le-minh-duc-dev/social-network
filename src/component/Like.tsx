import { createLike } from "@/actions/like/createLike"
import { deleteLike } from "@/actions/like/deleteLike"
import { QueryKey } from "@/domain/enums/QueryKey"
import { useAuth } from "@/hooks/useAuth"
import { LikeAPI } from "@/service/LikeAPI"
import { Button } from "@heroui/react"
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
  })

  useEffect(() => {
    if (data) {
      setIsLiked(data.exists)
    }
  }, [data])

  const toggleLike = async () => {
    if (isLiked) {
      setIsLiked(false)
      await deleteLike(postId)
    } else {
      setIsLiked(true)
      await createLike(postId)
    }
  }

  const mutation = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
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
    onError: (error) => {
      setIsLiked(!isLiked)
      console.log(error)
    },
  })

  return (
    <Button isIconOnly variant="light" onPress={() => mutation.mutate()}>
      {isLiked ? (
        <FaHeart className="text-2xl text-red-500" />
      ) : (
        <FaRegHeart className="text-2xl" />
      )}
    </Button>
  )
}
