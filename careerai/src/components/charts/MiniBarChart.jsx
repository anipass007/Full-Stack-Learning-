// Small bar chart without a chart library. data: [{ label, value }]
export default function MiniBarChart({ data, max = 100, label = 'Chart', barArea = 112 }) {
  const summary = data.map((item) => `${item.label} ${item.value}`).join(', ')
  return (
    <div role="img" aria-label={`${label}: ${summary}`} className="flex items-end gap-3">
      {data.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
          <span className="text-xs font-medium text-ink-muted">{item.value}</span>
          <div className="flex w-full items-end" style={{ height: barArea }}>
            <div
              className="w-full rounded-t-lg bg-brand/80 transition-[height] duration-500"
              style={{ height: Math.max(4, (item.value / max) * barArea) }}
            />
          </div>
          <span className="w-full truncate text-center text-xs text-ink-faint">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
