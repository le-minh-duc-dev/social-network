import { auth } from "./auth"

export class ServerSideAuthService {
  static async getAuthUser() {
    const authSession = await auth()
    return authSession?.user
  }
}
