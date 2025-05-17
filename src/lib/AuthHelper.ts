import { nanoid } from "nanoid"
export class AuthHelper {
  static generateUsername(normalizedFullName: string): string {
    const slug = normalizedFullName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
    const randomSuffix = nanoid(4)
    return `${slug}${randomSuffix}`
  }
}
