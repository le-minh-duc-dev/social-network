import { Permission } from "@/domain/enums/Permission"
import { Role } from "@/domain/enums/Role"

const data: Record<Role, Partial<Record<Permission, boolean>>> = {
  [Role.ADMIN]: {
    [Permission.CLEAR_CACHE]: true,
    [Permission.CHANGE_ACCOUNT_STATUS]: true,
  },
  [Role.MEMBER]: {
    [Permission.CLEAR_CACHE]: false,
    [Permission.CHANGE_ACCOUNT_STATUS]: false,
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
}
