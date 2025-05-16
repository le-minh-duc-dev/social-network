import bcrypt from "bcryptjs"

export class PasswordEncoder {
  static async encodePassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
  }
  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }
}
