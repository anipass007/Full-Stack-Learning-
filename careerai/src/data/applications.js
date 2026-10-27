// Sample applications. Dates are fixed so the demo looks the same every time.
export const seedApplications = [
  {
    id: 'app-1',
    jobId: 'frontend-intern-orbit',
    status: 'Interview',
    appliedOn: '2026-10-02',
    timeline: [
      { status: 'Applied', date: '2026-10-02' },
      { status: 'In review', date: '2026-10-04' },
      { status: 'Interview', date: '2026-10-08', note: 'First round scheduled' },
    ],
  },
  {
    id: 'app-2',
    jobId: 'junior-web-brightway',
    status: 'In review',
    appliedOn: '2026-10-05',
    timeline: [
      { status: 'Applied', date: '2026-10-05' },
      { status: 'In review', date: '2026-10-07' },
    ],
  },
  {
    id: 'app-3',
    jobId: 'data-analyst-lumen',
    status: 'Rejected',
    appliedOn: '2026-09-24',
    timeline: [
      { status: 'Applied', date: '2026-09-24' },
      { status: 'In review', date: '2026-09-27' },
      { status: 'Rejected', date: '2026-10-01', note: 'Looking for stronger SQL experience' },
    ],
  },
  {
    id: 'app-4',
    jobId: 'java-fresher-kite',
    status: 'Applied',
    appliedOn: '2026-10-08',
    timeline: [{ status: 'Applied', date: '2026-10-08' }],
  },
]
