import { format } from "date-fns"

export class Formater {
  static snakeCaseToTitleCase(str: string): string {
    if (!str || str.length == 0) return str
    return str
      .toLowerCase()
      .split("_")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  static kebabCaseToTitleCase(str: string): string {
    if (!str || str.length == 0) return str
    return str
      .toLowerCase()
      .split("-")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  static formatDate(dateStr: string) {
    const date = new Date(dateStr)
    return format(date, "MMMM d, yyyy 'at' h:mm a")
  }
}
