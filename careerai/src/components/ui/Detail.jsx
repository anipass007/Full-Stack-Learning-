// Label and value pair for read-only profile views. Put it inside a <dl>.
export default function Detail({ label, children }) {
  return (
    <div>
      <dt className="text-xs text-ink-faint">{label}</dt>
      <dd className="mt-1 text-sm text-ink">{children || <span className="text-ink-faint">Not added</span>}</dd>
    </div>
  )
}
