"use client"
import {
  addToast,
  Button,
  Card,
  CardBody,
  Form,
  Input,
  Textarea,
  User,
} from "@heroui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import React, { FormEvent, useEffect, useState } from "react"
import { useAuth } from "../provider/auth/AuthContext"
import {
  EditProfileSchema,
  EditProfileType,
} from "@/domain/zod/EditProfileSchema"
import { FilePreview } from "@/types/FilePreview"
import { MediaType } from "@/domain/enums/MediaType"
import { useMediaUpload } from "@/context/MediaUploadContext"
import { updateProfile } from "@/actions/user/updateProfile"
import { HttpStatus } from "@/domain/enums/HttpStatus"
import { QueryKey } from "@/domain/enums/QueryKey"
import { UserAPI } from "@/service/api/UserAPI"
import { useCheckExists } from "@/hooks/useCheckExists"
export default function EditProfile() {
  const { authUser } = useAuth()
  const uploadService = useMediaUpload()
  const [avatarFile, setAvatarFile] = useState<FilePreview | null>(null)

  const [formData, setFormData] = useState<EditProfileType>({
    bio: authUser?.bio,
    username: authUser?.username,
    avatarUrl: authUser?.avatarUrl ?? "",
  })

  const queryClient = useQueryClient()

  useEffect(() => {
    if (authUser) {
      console.log(authUser)
      setFormData({
        bio: authUser?.bio,
        username: authUser?.username,
        avatarUrl: authUser?.avatarUrl ?? "",
      })
    }
  }, [authUser])

  const mutation = useMutation({
    mutationFn: async ({
      hasNewAvatar,
      data,
    }: {
      hasNewAvatar: boolean
      data: EditProfileType
    }) => {
      const safeFormData = EditProfileSchema.safeParse(data)
      if (!safeFormData.success) {
        console.error("Post upload validation error:", safeFormData.error)
        return
      }
      return await updateProfile(safeFormData.data, hasNewAvatar)
    },
    onSuccess: (response) => {
      if (response?.status == HttpStatus.NO_CONTENT) {
        addToast({
          title: "Profile updated successfully",
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
          title: "Failed to update profile",
        })
      }
    },
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    let hasNewAvatar = false
    const data = formData
    if (avatarFile) {
      const { success, failed } = await uploadService.uploadFilePreviews([
        avatarFile,
      ])

      if (failed.length > 0) {
        // Handle failed uploads
        addToast({ title: "Failed to upload avatar" })
        return
      }
      const avatarUrl = success[0].preview

      data.avatarUrl = avatarUrl
      hasNewAvatar = true
    }
    mutation.mutate({ hasNewAvatar, data })
  }

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile({
        id: "1",
        file: file,
        preview: URL.createObjectURL(file),
        size: (file.size / 1024).toFixed(2) + " KB",
        type: file.type.startsWith("image") ? MediaType.IMAGE : MediaType.VIDEO,
      })
    }
  }

  const { data: isUsernameExists } = useCheckExists({
    value: formData.username,
    checkFn: UserAPI.checkExists,
    queryKeyPrefix: [QueryKey.GET_USERS, "USERNAME"],
  })

  return (
    <div className="h-full flex justify-center">
      <Form className=" w-[60%] py-8 gap-y-4" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold mt-4">Edit profile</h1>
        <Card
          classNames={{
            base: "w-full mt-12",
            body: "flex flex-row justify-between items-center p-6",
          }}
        >
          <CardBody>
            <User
              avatarProps={{
                src: avatarFile?.preview ?? formData.avatarUrl,
                size: "lg",
              }}
              description={authUser?.email}
              name={authUser?.name}
            />
            <Button color="primary">
              <label
                htmlFor="avatar"
                className="w-full h-full flex items-center cursor-pointer"
              >
                Change photo
              </label>
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handleSelectFile}
              id="avatar"
              className="hidden "
            />
          </CardBody>
        </Card>
        <div className="max-w-xs mt-8">
          <Input
            label="Username"
            labelPlacement="outside"
            placeholder="Username"
            type="text"
            variant="bordered"
            value={formData.username}
            errorMessage="Username already exists"
            isInvalid={isUsernameExists?.exists}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, username: value }))
            }
          />
        </div>
        <Textarea
          className=" w-full"
          label="Bio"
          placeholder="Enter your bio"
          labelPlacement="outside"
          variant="bordered"
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, bio: value }))
          }
          value={formData.bio}
        />

        <div className="flex justify-end mt-4 w-full">
          <Button
            color="primary"
            className="py-4 px-24 "
            type="submit"
            isLoading={mutation.isPending}
            isDisabled={mutation.isPending}
          >
            Submit
          </Button>
        </div>
      </Form>
    </div>
  )
}
