// Sample roadmap for a Frontend Developer target role.
export const milestones = [
  {
    id: 'm1',
    title: 'Strengthen JavaScript',
    description: 'Get comfortable with async code and everyday data handling.',
    tasks: [
      { id: 't1', title: 'Finish notes on promises and async/await', estimate: 'About 3 hours', due: 'Week 1' },
      { id: 't2', title: 'Build a to-do app that saves to local storage', estimate: 'About 5 hours', due: 'Week 1' },
      { id: 't3', title: 'Solve 10 array and object practice problems', estimate: 'About 4 hours', due: 'Week 2' },
    ],
  },
  {
    id: 'm2',
    title: 'Go deeper in React',
    description: 'Move from components to complete multi-page apps.',
    tasks: [
      { id: 't4', title: 'Learn React hooks in depth', estimate: 'About 4 hours', due: 'Week 2' },
      { id: 't5', title: 'Build a multi-page app with React Router', estimate: 'About 8 hours', due: 'Week 3' },
      { id: 't6', title: 'Add shared state to a project', estimate: 'About 5 hours', due: 'Week 4' },
    ],
  },
  {
    id: 'm3',
    title: 'APIs and testing',
    description: 'Learn to fetch data and prove that your code works.',
    tasks: [
      { id: 't7', title: 'Fetch data from a public REST API', estimate: 'About 4 hours', due: 'Week 5' },
      { id: 't8', title: 'Write unit tests for three components', estimate: 'About 5 hours', due: 'Week 5' },
      { id: 't9', title: 'Practise Git branches and pull requests', estimate: 'About 3 hours', due: 'Week 6' },
    ],
  },
  {
    id: 'm4',
    title: 'Portfolio and interviews',
    description: 'Show your work and practise talking about it.',
    tasks: [
      { id: 't10', title: 'Publish a portfolio site', estimate: 'About 8 hours', due: 'Week 7' },
      { id: 't11', title: 'Add three projects with README files', estimate: 'About 6 hours', due: 'Week 7' },
      { id: 't12', title: 'Complete two mock interviews', estimate: 'About 3 hours', due: 'Week 8' },
    ],
  },
]

export const allTasks = milestones.flatMap((milestone) =>
  milestone.tasks.map((task) => ({ ...task, milestoneId: milestone.id, milestoneTitle: milestone.title })),
)

export const initialCompleted = ['t1', 't2', 't4']
