import { MongooseHelper } from "@/lib/MongooseHelper"
import { PermissionService } from "@/service/PermissionService"
import { UserService } from "@/service/UserService"
import { AuthUser } from "@/types/auth"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  console.log(params)

  const userService = new UserService()

  let idObjectId
  try {
    idObjectId = MongooseHelper.toObjectId(id)
  } catch (error) {
    console.error("Invalid userId:", id, error)
    return new Response(null, { status: 400 })
  }
  const user = await userService.findUserById(idObjectId)
  if (!user) {
    return new Response(null, { status: 404 })
  }

  const response: AuthUser = {
    id: user._id.toString(),
    name: user.fullName,
    email: user.email,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    isVerified: user.isVerified,
    isActive: user.isActive,
    role: user.role,
    permissions: PermissionService.getPermissions(user.role),
    isFollowApprovalRequired: user.isFollowApprovalRequired,
  }

  return Response.json(response)
}
