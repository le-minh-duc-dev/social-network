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

  static formatDate(dateInput: string | Date) {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
    return format(date, "MMMM d, yyyy 'at' h:mm a")
  }
}
