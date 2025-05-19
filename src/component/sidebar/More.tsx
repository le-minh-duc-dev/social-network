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
import { FaRegBookmark, FaTools } from "react-icons/fa"
import { useAuth } from "@/component/provider/auth/AuthContext"
import { PermissionService } from "@/service/PermissionService"
import { Permission } from "@/domain/enums/Permission"

export default function More() {
  const { authUser } = useAuth()

  const canViewDashboard = PermissionService.hasPermission(
    authUser?.permissions,
    Permission.VIEW_DASHBOARD
  )
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light" className="lg:justify-start w-full ">
          <LuMenu className="text-3xl" />
          <div className="hidden lg:block">More</div>
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
            {canViewDashboard ? (
              <DropdownItem
                classNames={{ base: "p-3" }}
                key="admin"
                href={AppRouteManager.ADMIN}
                startContent={<FaTools className="text-lg" />}
              >
                Administrator
              </DropdownItem>
            ) : null}
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
              href={AppRouteManager.saved(authUser?.id)}
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
