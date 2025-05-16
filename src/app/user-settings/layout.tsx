import UserSettingsLayout from "@/component/userSettings/UserSettingsLayout"
import React from "react"

export default function page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <UserSettingsLayout>{children}</UserSettingsLayout>
}
