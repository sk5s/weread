import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Preferences } from "@capacitor/preferences"
import key from "../lib/storage.json"
import { SettingsContext } from "../SettingsContext"
import { DetailContext } from "../pages/Detail/Context"
import { useLocation } from "react-router"

interface ViewerContextType {
  fontSize: number
  saveFontSize: (newSize: number) => Promise<void>
  loadFontSize: () => Promise<void>
}

const ViewerContext = createContext<ViewerContextType | undefined>(undefined)

interface ViewerProviderProps {
  children: ReactNode
}

export function ViewerProvider({ children }: ViewerProviderProps) {
  const globalSettings = useContext(SettingsContext)
  const article = useContext<any>(DetailContext)
  const [fontSize, setFontSize] = useState<number>(24)
  const location = useLocation();

  useEffect(() => {
    if (article.id) {
      loadFontSize()
    }
  }, [location.key, article.id])


  const loadFontSize = async () => {
    const viewerData = await Preferences.get({ key: key.viewer })
    if (viewerData.value) {
      const viewerSettings = JSON.parse(viewerData.value)
      if (viewerSettings[article.id] && viewerSettings[article.id].fontSize) {
        setFontSize(viewerSettings[article.id].fontSize)
      } else {
        setFontSize(globalSettings.defaultFontSize || 24)
      }
    } else {
      setFontSize(globalSettings.defaultFontSize || 24)
    }
  }

  const saveFontSize = async (newSize: number) => {
    const viewerData = await Preferences.get({ key: key.viewer })
    let viewerSettings = viewerData.value ? JSON.parse(viewerData.value) : {}
    viewerSettings[article.id] = { fontSize: newSize }
    await Preferences.set({
      key: key.viewer,
      value: JSON.stringify(viewerSettings),
    })
    setFontSize(newSize)
  }

  return (
    <ViewerContext.Provider value={{ fontSize, saveFontSize, loadFontSize }}>
      {children}
    </ViewerContext.Provider>
  )
}

export function useViewerContext() {
  const context = useContext(ViewerContext)
  if (context === undefined) {
    throw new Error("useViewerContext must be used within a ViewerProvider")
  }
  return context
}
