"use client"

import Info from "./Info"

import CategoryTabs from "./CategoryTabs"
import PostList from "./PostList"
export default function Profile() {
  return (
    <div className="ml-[354px]  h-full">
      <div className="flex justify-center">
        <Info />
      </div>

      <div className="flex justify-center ">
        <div className="border-t border-t-white/15 pt-8 mt-8 w-[60%]">
          <CategoryTabs />
          <PostList />
        </div>
      </div>
    </div>
  )
}
