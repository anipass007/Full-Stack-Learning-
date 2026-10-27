import { useLocalStorage } from './useLocalStorage'
import { defaultSettings } from '../data/admin'

export function usePlatformSettings() {
  const [stored, setSettings] = useLocalStorage('platformSettings', defaultSettings)
  return [{ ...defaultSettings, ...stored }, setSettings]
}
