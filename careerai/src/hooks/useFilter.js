import { useMemo, useRef, useState } from 'react'

// Search + exact-match filters for list pages.
// A filter value of 'all' or '' means "no filter". If the item field is an array, the filter matches when it includes the value.
export function useFilter(items, { searchKeys = [], initialFilters = {} } = {}) {
  const initialRef = useRef(initialFilters)
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const searchKeyList = searchKeys.join('|')

  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const reset = () => {
    setQuery('')
    setFilters(initialRef.current)
  }

  const results = useMemo(() => {
    const keys = searchKeyList ? searchKeyList.split('|') : []
    const needle = query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesQuery =
        !needle ||
        keys.some((key) => {
          const field = item[key]
          const text = Array.isArray(field) ? field.join(' ') : String(field ?? '')
          return text.toLowerCase().includes(needle)
        })
      const matchesFilters = Object.entries(filters).every(([key, wanted]) => {
        if (wanted === 'all' || wanted === '' || wanted == null) return true
        const field = item[key]
        return Array.isArray(field) ? field.includes(wanted) : field === wanted
      })
      return matchesQuery && matchesFilters
    })
  }, [items, query, filters, searchKeyList])

  const isFiltered = query.trim() !== '' || JSON.stringify(filters) !== JSON.stringify(initialRef.current)

  return { query, setQuery, filters, setFilter, results, reset, isFiltered }
}
