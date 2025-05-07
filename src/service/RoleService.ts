import { Role } from "@/domain/enums/Role"

const rolePrivilege: Readonly<Record<Role, number>> = {
  [Role.ADMIN]: 100,
  [Role.MEMBER]: 10,
}

export class RoleService {
  static hasMorePrivilegeThan(role1: Role, role2: Role): boolean {
    const privilege1 = rolePrivilege[role1] ?? 0
    const privilege2 = rolePrivilege[role2] ?? 0
    return privilege1 > privilege2
  }

  static hasLessPrivilegeThan(role1: Role, role2: Role): boolean {
    const privilege1 = rolePrivilege[role1] ?? 0
    const privilege2 = rolePrivilege[role2] ?? 0
    return privilege1 < privilege2
  }
}
