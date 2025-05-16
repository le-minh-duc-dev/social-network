import { Switch } from "@heroui/react"
import React from "react"

export default function AccountPrivacy() {
  return (
    <div className="h-full flex justify-center">
      <div className=" w-[60%] py-8">
        <h1 className="text-2xl font-semibold mt-4">Account privacy</h1>
        <div className="border border-white/15 py-6 px-6 rounded-2xl mt-12 flex justify-between">
          <div className="">Follow approval required</div>
          <Switch defaultSelected aria-label="Automatic updates" />;
        </div>
      </div>
    </div>
  )
}
