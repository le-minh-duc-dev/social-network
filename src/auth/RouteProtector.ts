import { AppRouteManager } from "@/service/AppRouteManager"
import { auth } from "./auth"
import { redirect } from "next/navigation"
import { Role } from "@/domain/enums/Role"
import { RoleService } from "@/service/RoleService"
import { AuthUserHelper } from "@/lib/AuthUserHelper"
import { signOut } from "@/auth/auth"
export class RouteProtector {
  static async protect(role?: Role, onlyActiveAccount: boolean = true) {
    const session = await auth()

    console.log("session",session?.user);
    if (!session) {
      redirect(AppRouteManager.LOGIN)
    } else {
      const user = await AuthUserHelper.getAuthUser(session?.user.id)
      if (!user) {
        signOut({ redirectTo: AppRouteManager.LOGIN })
      }
      if (onlyActiveAccount && user?.isActive) {
        redirect(AppRouteManager.WELCOME_NEW_MEMBER)
      } else if (
        role &&
        user?.role &&
        RoleService.hasLessPrivilegeThan(user?.role, role)
      ) {
        redirect(AppRouteManager.HOME)
      }
    }
  }

  static async protectLoginAgain() {
    const session = await auth()
    if (session) redirect(AppRouteManager.HOME)
  }
}
