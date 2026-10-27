import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { getPageTitle } from '../../data/navigation'

// On every page change: scroll to top, update the tab title, and move focus to the main area
// so keyboard and screen reader users start at the new content.
export default function RouteEffects() {
  const { pathname } = useLocation()
  const previousPath = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = getPageTitle(pathname)
    if (previousPath.current !== null && previousPath.current !== pathname) {
      document.getElementById('main')?.focus({ preventScroll: true })
    }
    previousPath.current = pathname
  }, [pathname])

  return null
}
