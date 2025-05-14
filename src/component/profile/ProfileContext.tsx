import React from "react"
import { TabType } from "./Profile"

interface ProfileContextType {
  currentTab: TabType
  setCurrentTab: React.Dispatch<React.SetStateAction<TabType>>
}

export const ProfileContext = React.createContext<ProfileContextType | null>(null)
export const useProfileContext = () => {
  const context = React.useContext(ProfileContext)
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider")
  }
  return context
}
