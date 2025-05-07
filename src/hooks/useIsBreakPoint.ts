import { BreakPoint } from "@/domain/enums/BreakPoint"
import { useEffect, useState } from "react"


export function useIsBreakPoint(breakpoint = BreakPoint.LG) {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= breakpoint)
    }

    checkScreen()
    window.addEventListener("resize", checkScreen)
    return () => window.removeEventListener("resize", checkScreen)
  }, [breakpoint])

  return isDesktop
}
