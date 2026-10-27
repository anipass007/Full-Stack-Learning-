// Clears everything the demo saved in this browser, then reloads at the given path.
export function resetDemoData(redirectTo = '/') {
  Object.keys(window.localStorage)
    .filter((key) => key.startsWith('careerai:'))
    .forEach((key) => window.localStorage.removeItem(key))
  window.location.assign(redirectTo)
}
