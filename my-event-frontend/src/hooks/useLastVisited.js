import { useCallback } from 'react'
const KEY = 'quickpass-last-path'

export default function useLastVisited() {
  const setLastPath = useCallback((path) => {
    try { localStorage.setItem(KEY, path) } catch {}
  }, [])

  const getLastPath = useCallback(() => {
    try { return localStorage.getItem(KEY) } catch { return null }
  }, [])

  return { setLastPath, getLastPath }
}
