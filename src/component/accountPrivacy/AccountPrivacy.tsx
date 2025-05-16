"use client"
import { addToast, Switch } from "@heroui/react"
import { useAuth } from "../provider/auth/AuthContext"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfile } from "@/actions/user/updateProfile"
import { HttpStatus } from "@/domain/enums/HttpStatus"
import { QueryKey } from "@/domain/enums/QueryKey"

export default function AccountPrivacy() {
  const { authUser } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (isRequired: boolean) => {
      return await updateProfile(
        { isFollowApprovalRequired: isRequired },
        false
      )
    },
    onSuccess: (response) => {
      if (response?.status == HttpStatus.NO_CONTENT) {
        addToast({
          title: "Account privacy updated successfully",
        })
        queryClient.invalidateQueries({
          queryKey: [QueryKey.GET_USERS],
          exact: false,
        })
        queryClient.invalidateQueries({
          queryKey: [QueryKey.GET_USER_SAVEDS],
          exact: false,
        })
        queryClient.invalidateQueries({
          queryKey: [QueryKey.GET_POSTS],
          exact: false,
        })
        queryClient.invalidateQueries({
          queryKey: [QueryKey.GET_USER_SAVEDS],
          exact: false,
        })
      } else {
        addToast({
          title: "Failed to update Account privacy",
        })
      }
    },
  })

  if (!authUser) return <div>Loading...</div>
  return (
    <div className="h-full flex justify-center">
      <div className=" w-[60%] py-8">
        <h1 className="text-2xl font-semibold mt-4">Account privacy</h1>
        <div className="border border-white/15 py-6 px-6 rounded-2xl mt-12 flex justify-between">
          <div className="">Follow approval required</div>
          <Switch
            aria-label="Follow approval required"
            defaultSelected={authUser?.isFollowApprovalRequired}
            onValueChange={(isSelected) => {
              mutation.mutate(isSelected)
            }}
            isDisabled={mutation.isPending}
          />
        </div>
      </div>
    </div>
  )
}
