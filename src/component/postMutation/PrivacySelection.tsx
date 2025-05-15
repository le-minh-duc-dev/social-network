import { PostPrivacy } from "@/domain/enums/PostPrivacy"
import { Select, SelectItem } from "@heroui/react"
import { FaLock, FaUserFriends } from "react-icons/fa"
import { MdPublic } from "react-icons/md"
import { useMutatePostContext } from "./MutatePostContext"

export const privacies = [
  { key: PostPrivacy.PUBLIC, label: "Public", icon: <MdPublic /> },
  { key: PostPrivacy.FOLLOWERS, label: "Followers", icon: <FaUserFriends /> },
  { key: PostPrivacy.PRIVATE, label: "Private", icon: <FaLock /> },
]

export default function PrivacySelection() {
  const { privacyRef } = useMutatePostContext()

  return (
    <Select
      className="max-w-xs"
      label="Privacy"
      defaultSelectedKeys={[privacyRef.current]}
      variant="bordered"
      onSelectionChange={([key]) => {
        privacyRef.current = key as PostPrivacy
        console.log(privacyRef.current)
      }}
    >
      {privacies.map((privacy) => (
        <SelectItem key={privacy.key} startContent={privacy.icon}>
          {privacy.label}
        </SelectItem>
      ))}
    </Select>
  )
}
