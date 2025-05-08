"use client"
import { AppRoute } from "@/domain/enums/AppRoute"
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

export default function More() {
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
        classNames={{base:"w-64"}}
        onAction={(key) => {
          if (key == "logout") {
            signOut({ redirectTo: AppRoute.LOGIN })
          }
        }}
      >
        <DropdownSection showDivider>
          <DropdownItem
            classNames={{base:"p-3"}}

            key="settings"
            href={AppRoute.USER_SETTINGS}
            startContent={<IoSettingsOutline className="text-lg" />}
          >
            Settings
          </DropdownItem>
          <DropdownItem
            classNames={{base:"p-3"}}

            key="saved"
            href={AppRoute.SAVED}
            startContent={<FaRegBookmark className="text-lg" />}
          >
            Saved
          </DropdownItem>
        </DropdownSection>
        <DropdownSection>
          <DropdownItem
                      classNames={{base:"p-3"}}
          key="logout">Log out</DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
