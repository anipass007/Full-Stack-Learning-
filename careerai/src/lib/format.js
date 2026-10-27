export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function formatSalary({ salaryMin, salaryMax, salaryUnit }) {
  if (!salaryMin && !salaryMax) return 'Not disclosed'
  const fmt = (value) => `₹${Number(value).toLocaleString('en-IN')}`
  return `${fmt(salaryMin)} - ${fmt(salaryMax)} ${salaryUnit}`
}
