"use client"
import { AppRouteManager } from "@/service/AppRouteManager"
import { signOut } from "next-auth/react"
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/react"
import React from "react"
import { LuMenu } from "react-icons/lu"
import { IoSettingsOutline } from "react-icons/io5"
import { FaRegBookmark } from "react-icons/fa"
import { useAuth } from "@/component/provider/auth/AuthContext"

export default function More() {
  const { authUser } = useAuth()

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light" className="!justify-start">
          <LuMenu className="text-3xl" />
          <div className="">More</div>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Action event example"
        classNames={{ base: "w-64" }}
        onAction={(key) => {
          if (key == "logout") {
            signOut({ redirectTo: AppRouteManager.LOGIN })
          }
        }}
      >
        {authUser?.isActive ? (
          <DropdownSection showDivider>
            <DropdownItem
              classNames={{ base: "p-3" }}
              key="settings"
              href={AppRouteManager.USER_SETTINGS_EDIT_PROFILE}
              startContent={<IoSettingsOutline className="text-lg" />}
            >
              Settings
            </DropdownItem>
            <DropdownItem
              classNames={{ base: "p-3" }}
              key="saved"
              href={AppRouteManager.saved(authUser.id)}
              startContent={<FaRegBookmark className="text-lg" />}
            >
              Saved
            </DropdownItem>
          </DropdownSection>
        ) : null}

        <DropdownSection>
          <DropdownItem classNames={{ base: "p-3" }} key="logout">
            Log out
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
