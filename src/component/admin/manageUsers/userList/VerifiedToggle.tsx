import { toggleField } from "@/actions/user/toggleField"
import { HttpStatus } from "@/domain/enums/HttpStatus"
import { QueryKey } from "@/domain/enums/QueryKey"
import { ToastHelper } from "@/lib/ToastHelper"
import { User } from "@/types/schema"
import { addToast, Switch } from "@heroui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import React from "react"

export default function VerifiedToggle({
  user,
}: Readonly<{
  user: User
}>) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (status: boolean) =>
      await toggleField(user._id.toString(), "isVerified", status),
    onSuccess: (response) => {
      if (response.status == HttpStatus.NO_CONTENT) {
        addToast({
          title:
            user.fullName +
            " is now " +
            (user.isActive ? "inactive" : "active"),
        })
        queryClient.invalidateQueries({
          queryKey: [QueryKey.GET_USERS],
          exact: false,
        })
        queryClient.invalidateQueries({
          queryKey: [QueryKey.GET_USER],
          exact: false,
        })
      } else {
        ToastHelper.makeMutationErrorToast()
      }
    },
    onError: () => {
      ToastHelper.makeMutationErrorToast()
    },
  })
  return (
    <Switch
      size="sm"
      defaultSelected={user.isVerified}
      color={"success"}
      isDisabled={mutation.isPending}
      onValueChange={(isSelelected) => mutation.mutate(isSelelected)}
    >
      {user.isVerified ? "Verified" : "Unverified"}
    </Switch>
  )
}
