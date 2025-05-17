import { AuthUserHelper } from "@/lib/AuthUserHelper"
import { auth } from "./auth"

export class ServerSideAuthService {
  static async getAuthUser() {
    const authSession = await auth()
    if (!authSession) {
      return null
    }
    return AuthUserHelper.getAuthUser(authSession?.user.id)
  }

  static async isAuthenticated() {
    const authSession = await auth()
    return !!authSession
  }
}
