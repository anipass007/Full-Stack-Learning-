// Local role baselines for transparent skill comparisons; importance: critical | important | nice.
export const targetRoles = {
  'Frontend Developer': [
    { skill: 'HTML', required: 80, importance: 'critical' },
    { skill: 'CSS', required: 80, importance: 'critical' },
    { skill: 'JavaScript', required: 80, importance: 'critical' },
    { skill: 'React', required: 75, importance: 'critical' },
    { skill: 'TypeScript', required: 60, importance: 'important' },
    { skill: 'REST APIs', required: 65, importance: 'important' },
    { skill: 'Git', required: 60, importance: 'important' },
    { skill: 'Testing', required: 50, importance: 'important' },
    { skill: 'Responsive design', required: 70, importance: 'important' },
    { skill: 'Accessibility', required: 40, importance: 'nice' },
  ],
  'Full Stack Developer': [
    { skill: 'JavaScript', required: 80, importance: 'critical' },
    { skill: 'React', required: 70, importance: 'critical' },
    { skill: 'Node.js', required: 70, importance: 'critical' },
    { skill: 'SQL', required: 65, importance: 'critical' },
    { skill: 'REST APIs', required: 70, importance: 'critical' },
    { skill: 'HTML', required: 70, importance: 'important' },
    { skill: 'Git', required: 60, importance: 'important' },
    { skill: 'MongoDB', required: 50, importance: 'important' },
    { skill: 'Testing', required: 45, importance: 'nice' },
  ],
  'Data Analyst': [
    { skill: 'SQL', required: 75, importance: 'critical' },
    { skill: 'Excel', required: 70, importance: 'critical' },
    { skill: 'Python', required: 65, importance: 'critical' },
    { skill: 'Statistics', required: 60, importance: 'important' },
    { skill: 'Data visualization', required: 60, importance: 'important' },
    { skill: 'Problem solving', required: 60, importance: 'nice' },
  ],
}

export const roleNames = Object.keys(targetRoles)

// Generic, free ways to practise each skill. No external links are assumed.
export const learningActions = {
  TypeScript: 'Convert one of your React projects from JavaScript to TypeScript, one file at a time.',
  'REST APIs': 'Build a small app that reads from a public API and handles loading and error states.',
  Testing: 'Write unit tests for three components using Vitest and React Testing Library.',
  React: 'Build a multi-page app that uses hooks, routing and shared state.',
  Accessibility: 'Audit one of your pages with keyboard-only navigation and fix what breaks.',
  Git: 'Practise branching, pull requests and resolving a merge conflict on a practice repo.',
  'Node.js': 'Build a small Express server with two routes and connect it to a React page.',
  MongoDB: 'Create a notes API that stores data in MongoDB and supports create, read, update and delete.',
  SQL: 'Solve 15 join and group-by problems on a free practice site.',
  Python: 'Clean and summarise a CSV file using pandas.',
  Statistics: 'Work through mean, median, variance and correlation using a small real dataset.',
  'Data visualization': 'Chart a public dataset and write three insights from it.',
  Excel: 'Build a pivot table and a lookup-based report from a sample sheet.',
  JavaScript: 'Practise array methods and async code with 10 short exercises.',
  CSS: 'Rebuild a landing page layout using only Flexbox and Grid.',
  HTML: 'Rewrite a page using semantic elements and check it with an HTML validator.',
  'Responsive design': 'Make one page work from 320px to 1440px without horizontal scrolling.',
  'Problem solving': 'Solve one short algorithm problem each day for two weeks.',
}
