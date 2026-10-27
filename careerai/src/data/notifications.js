// Sample notifications for the demo. Nothing here is sent by a server.
export const studentNotifications = [
  { id: 's1', title: 'Resume analysis ready', body: 'Your latest resume has a new sample ATS report.', time: '5 min ago', unread: true },
  { id: 's2', title: 'Application update', body: 'Your application to Frontend Intern moved to review.', time: '2 hours ago', unread: true },
  { id: 's3', title: 'Roadmap reminder', body: 'You have 2 learning tasks due this week.', time: 'Yesterday', unread: false },
]

export const recruiterNotifications = [
  { id: 'r1', title: 'New applicants', body: '4 candidates applied to React Developer Intern.', time: '10 min ago', unread: true },
  { id: 'r2', title: 'Job under review', body: 'Your new posting is waiting for admin approval.', time: '3 hours ago', unread: true },
  { id: 'r3', title: 'Job closing soon', body: 'Data Analyst Trainee closes in 2 days.', time: 'Yesterday', unread: false },
]

export const adminNotifications = [
  { id: 'a1', title: 'Recruiter verification', body: '3 recruiters are waiting for verification.', time: '15 min ago', unread: true },
  { id: 'a2', title: 'Job reported', body: 'A job posting was reported for review.', time: '1 hour ago', unread: true },
  { id: 'a3', title: 'Weekly summary', body: 'Sample platform summary is ready.', time: 'Yesterday', unread: false },
]
