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

  static formatTimeAgo(timestamp: Date | string | number): string {
    const now = new Date()
    const postDate = new Date(timestamp)
    const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000)

    const intervals = [
      { label: "y", seconds: 31536000 },
      { label: "mo", seconds: 2592000 },
      { label: "w", seconds: 604800 },
      { label: "d", seconds: 86400 },
      { label: "h", seconds: 3600 },
      { label: "m", seconds: 60 },
      { label: "s", seconds: 1 },
    ]

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds)
      if (count >= 1) {
        return `${count}${interval.label}`
      }
    }

    return "just now"
  }
}
