import { createContext } from "react";
import defaultSettings from './lib/defaultSettings.json'

export const SettingsContext = createContext(defaultSettings)