import { AppRouteManager } from "@/service/AppRouteManager"
import { auth } from "./auth"
import { redirect } from "next/navigation"
import { Role } from "@/domain/enums/Role"
import { RoleService } from "@/service/RoleService"
export class RouteProtector {
  static async protect(role?: Role, onlyActiveAccount: boolean = true) {
    const session = await auth()
    if (!session) {
      redirect(AppRouteManager.LOGIN)
    } else if (onlyActiveAccount && !session.user.isActive) {
      redirect(AppRouteManager.WELCOME_NEW_MEMBER)
    } else if (
      role &&
      RoleService.hasLessPrivilegeThan(session.user.role, role)
    ) {
      redirect(AppRouteManager.HOME)
    }
  }

  static async protectLoginAgain() {
    const session = await auth()
    if (session) redirect(AppRouteManager.HOME)
  }
}
