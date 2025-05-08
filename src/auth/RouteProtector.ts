import { AppRoute } from "@/domain/enums/AppRoute"
import { auth } from "./auth"
import { redirect } from "next/navigation"
import { Role } from "@/domain/enums/Role"
import { RoleService } from "@/service/RoleService"
export class RouteProtector {
  static async protect(role?: Role, onlyActiveAccount: boolean = true) {
    const session = await auth()
    console.log(session?.user)
    if (!session) {
      redirect(AppRoute.LOGIN)
    } else if (onlyActiveAccount && !session.user.isActive) {
      redirect(AppRoute.WELCOME_NEW_MEMBER)
    } else if (
      role &&
      RoleService.hasLessPrivilegeThan(session.user.role, role)
    ) {
      redirect(AppRoute.HOME)
    }
  }

  static async protectLoginAgain() {
    const session = await auth()
    if (session) redirect(AppRoute.HOME)
  }
}
