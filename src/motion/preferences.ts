import { createContext, useContext } from 'react'

export const MotionPreferencesContext = createContext(false)

export function useMotionPreferences(): boolean {
  return useContext(MotionPreferencesContext)
}
