import { Permission } from "@/domain/enums/Permission"
import { Role } from "@/domain/enums/Role"

const data: Record<Role, Partial<Record<Permission, boolean>>> = {
  [Role.ADMIN]: {
    [Permission.CLEAR_CACHE]: true,
    [Permission.CHANGE_ACCOUNT_STATUS]: true,
    [Permission.UPDATE_OWN_PROFILE]: true,
    [Permission.VIEW_DASHBOARD]: true,
    [Permission.MANAGE_USERS]: true,
    [Permission.MANAGE_POSTS]: true,
  },
  [Role.MEMBER]: {
    [Permission.UPDATE_OWN_PROFILE]: true,
  },
}
export class PermissionService {
  static getPermissions(role: Role) {
    return data[role] ?? {}
  }
  static hasDeletePostPermission(
    userId: string,
    userRole: Role,
    postAuthorId: string
  ): boolean {
    if (userRole == Role.ADMIN) return true
    return userId == postAuthorId
  }

  static hasPermission(
    permissions: Partial<Record<Permission, boolean>> | undefined,
    permission: Permission
  ): boolean {
    if (!permissions) return false
    return permissions[permission] ?? false
  }
}
