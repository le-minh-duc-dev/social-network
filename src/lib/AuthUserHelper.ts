import { UserService } from "@/service/UserService"
import { MongooseHelper } from "./MongooseHelper"
import { AuthUser } from "@/types/auth"
import { PermissionService } from "@/service/PermissionService"

export class AuthUserHelper {
  static async getAuthUser(id: string) {
    const userService = new UserService()

    let idObjectId
    try {
      idObjectId = MongooseHelper.toObjectId(id)
    } catch (error) {
      console.error("Invalid userId:", id, error)
      return null
    }
    const user = await userService.findUserById(idObjectId)
    if (!user) {
      return null
    }

    const authUser: AuthUser = {
      id: user._id.toString(),
      name: user.fullName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      isVerified: user.isVerified,
      isActive: user.isActive,
      role: user.role,
      isFollowApprovalRequired: user.isFollowApprovalRequired,
      permissions: PermissionService.getPermissions(user.role),
      username: user.username,
    }

    return authUser
  }
}
