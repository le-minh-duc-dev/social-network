import { Tab, Tabs } from "@heroui/react"
import { TfiLayoutGrid3 } from "react-icons/tfi"
import { PiFilmReel } from "react-icons/pi"
import { FaRegBookmark } from "react-icons/fa"
import { useProfileContext } from "./ProfileContext"
import { TabType } from "./Profile"
import { useAuth } from "@/hooks/useAuth"
export default function CategoryTabs() {
  const { setCurrentTab, currentTab, userId } = useProfileContext()
  const { authUser } = useAuth()

  return (
    <div className="flex justify-center">
      <Tabs
        aria-label="Tabs variants"
        variant="underlined"
        classNames={{ tabList: "gap-x-12" }}
        onSelectionChange={(key) => {
          setCurrentTab(key.toString() as TabType)
        }}
        selectedKey={currentTab}
      >
        <Tab
          key="posts"
          title={
            <div className="flex items-center space-x-2">
              <TfiLayoutGrid3 className="text-xs" />
              <span className="uppercase font-semibold">Posts</span>
            </div>
          }
        />
        <Tab
          key="reels"
          title={
            <div className="flex items-center space-x-2">
              <PiFilmReel />
              <span className="uppercase font-semibold">Reels</span>
            </div>
          }
        />
        {userId == authUser?.id ? (
          <Tab
            key="saved"
            title={
              <div className="flex items-center space-x-2">
                <FaRegBookmark />
                <span className="uppercase font-semibold">Saved</span>
              </div>
            }
          />
        ) : null}
      </Tabs>
    </div>
  )
}
