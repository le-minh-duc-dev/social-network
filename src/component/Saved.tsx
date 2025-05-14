import { createSaved } from "@/actions/saved/createSaved"
import { deleteSaved } from "@/actions/saved/deleteSaved"
import { HttpMessages, HttpStatus } from "@/domain/enums/HttpStatus"
import { QueryKey, QueryStaleTime } from "@/domain/enums/QueryKey"
import { useAuth } from "@/hooks/useAuth"
import { SavedAPI } from "@/service/api/SavedAPI"
import { addToast, Button } from "@heroui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { FaBookmark, FaRegBookmark } from "react-icons/fa"

export default function Saved({ postId }: Readonly<{ postId: string }>) {
  const { authUser } = useAuth()
  const [isSaved, setIsSaved] = useState(false)
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryFn: () => SavedAPI.checkSavedExists(postId),
    queryKey: [QueryKey.GET_USER_SAVEDS, postId, authUser?.id],
    staleTime: QueryStaleTime[QueryKey.GET_USER_SAVEDS],
  })

  useEffect(() => {
    if (data) {
      setIsSaved(data.exists)
    }
  }, [data])

  const toggleSaved = async () => {
    if (isSaved) {
      setIsSaved(false)
      return await deleteSaved(postId)
    } else {
      setIsSaved(true)
      return await createSaved(postId)
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
        queryKey: [QueryKey.GET_USER_SAVEDS],
        exact: false,
      })
      if (response.status == HttpStatus.CREATED) {
        addToast({
          title: "Post saved successfully",
        })
      }
      if (response.status == HttpStatus.NO_CONTENT) {
        addToast({
          title: "Post unsaved successfully",
        })
      }
    },
    onError: () => {
      setIsSaved(!isSaved)
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
      {isSaved ? (
        <FaBookmark className="text-xl" />
      ) : (
        <FaRegBookmark className="text-xl" />
      )}
    </Button>
  )
}
