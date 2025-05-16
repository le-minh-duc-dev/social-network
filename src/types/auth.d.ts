import { Permission } from "@/domain/enums/Permission"
import { Role } from "@/domain/enums/Role"

interface AuthUser {
  id: string
  name: string
  email: string
  bio?: string
  avatarUrl?: string
  isVerified: boolean
  isActive: boolean
  role: Role
  permissions: Partial<Record<Permission, boolean>>
  
}
