// Small SVG line chart without a chart library.
// series: [{ name, color, values }], labels: x axis labels (same length as values)
export default function LineChart({ series, labels, label = 'Line chart', height = 240 }) {
  const width = 640
  const pad = { top: 16, right: 16, bottom: 28, left: 48 }
  const plotW = width - pad.left - pad.right
  const plotH = height - pad.top - pad.bottom

  const rawMax = Math.max(...series.flatMap((item) => item.values))
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)))
  // Pick the smallest round step (1, 2, 2.5 or 5 times a power of ten) that needs 5 grid lines or fewer.
  const step = [magnitude / 10, magnitude, magnitude * 10]
    .flatMap((base) => [1, 2, 2.5, 5].map((factor) => base * factor))
    .sort((a, b) => a - b)
    .find((candidate) => Math.ceil(rawMax / candidate) <= 5)
  const max = Math.ceil(rawMax / step) * step
  const ticks = Array.from({ length: max / step + 1 }, (_, index) => Math.round(index * step))

  const x = (index) => pad.left + (labels.length === 1 ? plotW / 2 : (index / (labels.length - 1)) * plotW)
  const y = (value) => pad.top + plotH - (value / max) * plotH

  return (
    <div>
      <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} className="h-auto w-full min-w-[540px]">
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={pad.left} x2={width - pad.right} y1={y(tick)} y2={y(tick)} stroke="rgba(248,250,252,0.08)" />
            <text x={pad.left - 8} y={y(tick) + 4} textAnchor="end" fontSize="11" fill="#8286AA">
              {tick.toLocaleString('en-IN')}
            </text>
          </g>
        ))}
        {labels.map((item, index) => (
          <text key={item} x={x(index)} y={height - 8} textAnchor="middle" fontSize="11" fill="#8286AA">
            {item}
          </text>
        ))}
        {series.map((item) => (
          <g key={item.name}>
            <polyline
              fill="none"
              stroke={item.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={item.values.map((value, index) => `${x(index)},${y(value)}`).join(' ')}
            />
            {item.values.map((value, index) => (
              <circle key={index} cx={x(index)} cy={y(value)} r="3.5" fill="#24264A" stroke={item.color} strokeWidth="2" />
            ))}
          </g>
        ))}
      </svg>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-muted">
        {series.map((item) => (
          <li key={item.name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} aria-hidden="true" />
            {item.name}
          </li>
        ))}
      </ul>
      <table className="sr-only">
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">Period</th>
            {series.map((item) => (
              <th key={item.name} scope="col">
                {item.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((item, index) => (
            <tr key={item}>
              <th scope="row">{item}</th>
              {series.map((entry) => (
                <td key={entry.name}>{entry.values[index]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
