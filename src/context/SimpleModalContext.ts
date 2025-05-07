import { createContext, useContext } from "react"

export interface SimpleModalContextType {
  setTitle: (title: string) => void
  setContent: (content: string) => void
  isOpen: boolean
  onOpen: () => void
}

export const SimpleModalContext = createContext<SimpleModalContextType>({
  isOpen: false,
  onOpen: () => {},
  setTitle: () => {},
  setContent: () => {},
})

export const useSimpleModal = () => {
  return useContext(SimpleModalContext)
}
