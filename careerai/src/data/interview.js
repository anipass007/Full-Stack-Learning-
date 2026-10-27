import { roleNames } from './skills'

export const difficulties = [
  { id: 'Easy', description: 'Core concepts and definitions.' },
  { id: 'Medium', description: 'Explaining how things work and when to use them.' },
  { id: 'Hard', description: 'Design, trade-offs and problem solving.' },
]

export const interviewCategories = [
  { id: 'Technical', description: 'Role concepts, tools and technical decisions.' },
  { id: 'Behavioural', description: 'Communication, teamwork and learning from experience.' },
  { id: 'Situational', description: 'How you would respond to realistic work scenarios.' },
]

export const interviewRoles = roleNames

const q = (text, keywords, ideal) => ({ text, keywords, ideal })

// Sample question bank. Keywords drive the simulated evaluation.
const bank = {
  'Frontend Developer': {
    Easy: [
      q('What is the difference between a block element and an inline element in HTML?', ['block', 'inline', 'width', 'line'], 'Block elements start on a new line and take the full width. Inline elements sit inside a line of text and ignore width and height.'),
      q('What does the CSS box model describe?', ['content', 'padding', 'border', 'margin'], 'Every element is a box made of content, padding, border and margin, from the inside out. It decides how much space the element takes.'),
      q('What is the difference between let, const and var in JavaScript?', ['scope', 'reassign', 'hoisting', 'block'], 'let and const are block scoped, while var is function scoped and hoisted. const cannot be reassigned.'),
      q('What is a React component?', ['reusable', 'props', 'jsx', 'function'], 'A reusable piece of the interface, usually a function that takes props and returns JSX.'),
    ],
    Medium: [
      q('How does the useState hook work, and when would you use useEffect instead?', ['state', 'render', 'side effect', 'dependency'], 'useState stores a value that triggers a re-render when it changes. useEffect runs side effects such as fetching data, and its dependency array controls when it runs.'),
      q('Explain props and state in React and how they differ.', ['props', 'state', 'parent', 'update'], 'Props are inputs passed from a parent and are read-only. State is owned by the component and changes over time, which triggers an update.'),
      q('How would you make a web page responsive?', ['media query', 'flexbox', 'grid', 'viewport'], 'Set the viewport meta tag, use flexible layouts such as flexbox or grid, and add media queries for breakpoints. Test on small screens first.'),
      q('What is the difference between == and === in JavaScript?', ['type', 'coercion', 'strict', 'compare'], '== converts types before comparing, which is called coercion. === is strict and compares both type and value, so it is safer.'),
    ],
    Hard: [
      q('How would you improve the performance of a slow React page?', ['memo', 'lazy', 'render', 'profiler'], 'Measure first with the profiler, then reduce unnecessary renders with memo, split code with lazy loading, and keep expensive work out of render.'),
      q('Explain how the JavaScript event loop works.', ['call stack', 'queue', 'async', 'promise'], 'The call stack runs synchronous code. Async callbacks and promise jobs wait in queues, and the event loop moves them to the stack when it is empty.'),
      q('How do you make a web app accessible?', ['semantic', 'keyboard', 'aria', 'contrast'], 'Use semantic HTML, make everything usable by keyboard, add ARIA only where needed, keep enough colour contrast and test with a screen reader.'),
      q('How would you manage state in a large React app?', ['context', 'reducer', 'global', 'props drilling'], 'Keep state close to where it is used, lift it when needed, and use context with a reducer or a state library for shared global state to avoid props drilling.'),
    ],
  },
  'Full Stack Developer': {
    Easy: [
      q('What is a REST API?', ['http', 'resource', 'get', 'json'], 'An API that exposes resources over HTTP, using methods such as GET and POST, and usually exchanges JSON.'),
      q('What is the difference between SQL and NoSQL databases?', ['table', 'schema', 'document', 'scale'], 'SQL databases store data in tables with a fixed schema. NoSQL databases use flexible models such as documents and often scale out more easily.'),
      q('What is the role of Node.js in a web application?', ['javascript', 'server', 'runtime', 'asynchronous'], 'Node.js is a JavaScript runtime that lets you run JavaScript on a server, with an asynchronous model that handles many requests.'),
      q('What is the difference between frontend and backend?', ['browser', 'server', 'database', 'interface'], 'The frontend is the interface that runs in the browser. The backend runs on a server, handles logic and talks to the database.'),
    ],
    Medium: [
      q('How does authentication with JWT work?', ['token', 'sign', 'header', 'expire'], 'The server signs a token after login. The client sends it in a header on each request, and the server verifies it. Tokens should expire.'),
      q('Explain how you would design a simple notes app, from database to UI.', ['schema', 'endpoint', 'component', 'validation'], 'Define a notes schema, build endpoints for create, read, update and delete, validate input, and build components that call those endpoints.'),
      q('What are HTTP status codes? Give examples.', ['200', '404', '500', '401'], 'They tell the client the result of a request: 200 success, 401 unauthorised, 404 not found and 500 server error.'),
      q('How do you handle errors in an Express API?', ['middleware', 'try', 'status', 'log'], 'Wrap async code in try and catch, pass errors to an error-handling middleware, send a proper status code and log the details.'),
    ],
    Hard: [
      q('How would you design pagination for a large list?', ['limit', 'offset', 'cursor', 'index'], 'Return a limited page at a time using limit and offset, or a cursor for large or changing data, and index the sorted column.'),
      q('How would you secure a web application?', ['validation', 'https', 'hash', 'injection'], 'Validate input, protect against injection, use HTTPS, hash passwords, handle CORS carefully and keep dependencies updated.'),
      q('How would you scale an API that is getting slow?', ['cache', 'index', 'load', 'database'], 'Find the bottleneck first. Then add caching, database indexes, and load balancing, and move slow work to a queue.'),
      q('Explain database indexing and its trade-offs.', ['index', 'read', 'write', 'storage'], 'An index speeds up reads on a column but costs extra storage and slows writes, so index only what queries need.'),
    ],
  },
  'Data Analyst': {
    Easy: [
      q('What is the difference between a primary key and a foreign key?', ['unique', 'table', 'reference', 'relationship'], 'A primary key uniquely identifies a row in a table. A foreign key references a primary key in another table to create a relationship.'),
      q('What do the mean, median and mode tell you?', ['average', 'middle', 'frequent', 'outlier'], 'Mean is the average, median is the middle value, and mode is the most frequent value. The median resists outliers.'),
      q('What is a pivot table used for?', ['summarise', 'group', 'rows', 'columns'], 'It summarises data by grouping it into rows and columns and applying calculations such as sum or count.'),
      q('What is the difference between INNER JOIN and LEFT JOIN?', ['matching', 'all rows', 'null', 'table'], 'INNER JOIN keeps only matching rows. LEFT JOIN keeps all rows from the left table and fills non-matches with null.'),
    ],
    Medium: [
      q('How do you clean a messy dataset?', ['missing', 'duplicate', 'format', 'validate'], 'Check for missing values and duplicates, fix formats, handle outliers, and validate the result against known rules.'),
      q('What is the difference between WHERE and HAVING in SQL?', ['filter', 'group', 'aggregate', 'before'], 'WHERE filters rows before grouping. HAVING filters groups after aggregation.'),
      q('How would you choose the right chart for your data?', ['trend', 'comparison', 'distribution', 'audience'], 'Match the chart to the question: lines for trends, bars for comparison, histograms for distribution, and keep the audience in mind.'),
      q('What is correlation, and why does it not imply causation?', ['relationship', 'cause', 'variable', 'confound'], 'Correlation is a relationship between two variables. A hidden confounding variable may explain it, so one does not necessarily cause the other.'),
    ],
    Hard: [
      q('How would you investigate a sudden drop in website sales?', ['segment', 'compare', 'trend', 'hypothesis'], 'Check data quality first, then segment by channel, device and region, compare with earlier periods, and test hypotheses one by one.'),
      q('Explain what a window function does in SQL.', ['partition', 'over', 'rank', 'running'], 'It calculates across related rows without collapsing them, using OVER with PARTITION BY, for example rank or a running total.'),
      q('How would you design an A/B test and read its results?', ['control', 'sample', 'significance', 'random'], 'Randomly split users into control and variant, choose a metric and sample size in advance, and check statistical significance before deciding.'),
      q('How do you handle outliers, and when would you keep them?', ['detect', 'cause', 'remove', 'real'], 'Detect them, find the cause, and remove them only if they are errors. Keep them if they are real and affect the decision.'),
    ],
  },
}

const roleFocus = {
  'Frontend Developer': ['React components', 'accessibility', 'responsive interfaces', 'browser performance'],
  'Full Stack Developer': ['API design', 'database changes', 'authentication', 'deployment'],
  'Data Analyst': ['data quality', 'SQL analysis', 'visualisation', 'communicating findings'],
}

const experienceQuestions = {
  Behavioural: [
    (focus) => q(`Tell me about a project where you had to improve ${focus[0]}. What did you do and what changed?`, ['project', 'challenge', 'action', 'result'], 'Use a concrete example: describe the situation, your action and the result.'),
    (focus) => q(`Describe a time you received feedback about ${focus[1]}. How did you respond?`, ['feedback', 'listen', 'change', 'result'], 'Explain the feedback, how you responded and what you learned.'),
    (focus) => q(`Tell me about a time you worked with others on ${focus[2]}. How did you contribute?`, ['team', 'contribute', 'communicate', 'result'], 'Describe the shared goal, your contribution and the outcome.'),
    (focus) => q(`Describe a mistake or setback involving ${focus[3]}. What did you learn?`, ['mistake', 'learn', 'change', 'prevent'], 'Own the setback, explain what you learned and how you changed your approach.'),
  ],
  Situational: [
    (focus) => q(`A deadline is close and ${focus[0]} is not working as expected. How would you respond?`, ['prioritise', 'investigate', 'communicate', 'test'], 'Prioritise impact, investigate the cause, communicate trade-offs and verify the fix.'),
    (focus) => q(`A teammate disagrees with your approach to ${focus[1]}. How would you work through it?`, ['listen', 'evidence', 'trade-off', 'decide'], 'Listen to the concern, compare evidence and trade-offs, then agree on a decision and check its result.'),
    (focus) => q(`You discover a quality issue in ${focus[2]} shortly before delivery. What would you do?`, ['impact', 'inform', 'fix', 'validate'], 'Assess impact, inform affected people, choose a safe fix and validate before delivery.'),
    (focus) => q(`You have little context but need to make progress on ${focus[3]}. What steps would you take?`, ['clarify', 'assumption', 'small', 'feedback'], 'Clarify the goal, state assumptions, take a small verifiable step and seek feedback.'),
  ],
}

export function getQuestions(role, difficulty, category = 'Technical') {
  const list = category === 'Technical'
    ? bank[role]?.[difficulty] ?? []
    : (experienceQuestions[category] ?? []).map((build) => build(roleFocus[role] ?? roleFocus['Frontend Developer']))
  return list.map((item, index) => ({ ...item, id: `${role}-${difficulty}-${category}-${index}`, difficulty, category }))
}

const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)))
const STRUCTURE_WORDS = ['first', 'because', 'for example', 'for instance', 'such as', 'therefore', 'in my project', 'i built', 'i used', 'as a result', 'however']

export const MIN_WORDS = 15

// Local rule-based evaluation. It checks keyword coverage, answer length and structure; it is not an AI model.
export function evaluateAnswer(question, answer) {
  const text = answer.trim()
  const lower = text.toLowerCase()
  const wordCount = text.split(/\s+/).filter(Boolean).length
  const hits = question.keywords.filter((keyword) => lower.includes(keyword.toLowerCase()))
  const missed = question.keywords.filter((keyword) => !hits.includes(keyword))

  const relevance = clamp((hits.length / question.keywords.length) * 100)
  const depth = clamp((wordCount / 60) * 100)

  const sentences = text.split(/[.!?]+/).filter((part) => part.trim()).length
  const averageLength = wordCount / Math.max(sentences, 1)
  const hasStructure = STRUCTURE_WORDS.some((word) => lower.includes(word))
  let clarity = 60
  if (averageLength <= 25) clarity += 15
  else if (averageLength > 35) clarity -= 15
  if (sentences >= 3) clarity += 10
  if (hasStructure) clarity += 15
  clarity = clamp(clarity)

  const overall = clamp(relevance * 0.5 + depth * 0.3 + clarity * 0.2)

  const strengths = []
  if (hits.length) strengths.push(`You covered: ${hits.join(', ')}.`)
  if (wordCount >= 60) strengths.push('Good level of detail.')
  if (hasStructure) strengths.push('You gave reasons or examples, which makes an answer easier to follow.')
  if (strengths.length === 0) strengths.push('You attempted the question. Build on it with more specific terms.')

  const improvements = []
  if (missed.length) improvements.push(`Consider mentioning: ${missed.join(', ')}.`)
  if (wordCount < 40) improvements.push('Add more detail. Aim for 60 to 120 words.')
  if (!hasStructure) improvements.push('Add a concrete example from a project or from practice.')
  if (averageLength > 35) improvements.push('Break long sentences into shorter ones.')

  return { overall, relevance, depth, clarity, wordCount, hits, missed, strengths, improvements }
}

const dimensionLabels = { relevance: 'Relevance', depth: 'Completeness', clarity: 'Clarity' }

const advice = {
  relevance: 'Use the vocabulary of the role. Name specific tools and concepts in every answer.',
  depth: 'Aim for 60 to 120 words and explain why, not only what.',
  clarity: 'Use short sentences and a simple order: point, reason, example.',
}

// Returns dimensions sorted from weakest to strongest, each with advice.
export function getFocusAreas(dims) {
  return Object.keys(dimensionLabels)
    .map((key) => ({ key, label: dimensionLabels[key], value: dims[key] ?? 0, advice: advice[key] }))
    .sort((a, b) => a.value - b.value)
}
