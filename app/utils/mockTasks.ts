import type { Task } from '~/types/task'

// Stand-in for a real backend. The store copies this into state after
// a simulated delay so the UI has real loading/error states to handle,
// per the brief's "mock data with setTimeout" option.
export const MOCK_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Set up project repo',
    description: 'Initialize the repo, add linting, and push the first commit.',
    status: 'done',
    dueDate: '2026-06-10'
  },
  {
    id: 't-2',
    title: 'Design task list layout',
    description: 'Sketch the list view, including filters and the empty state.',
    status: 'done',
    dueDate: '2026-06-18'
  },
  {
    id: 't-3',
    title: 'Build task form validation',
    description: 'Title is required, due date must be in the future.',
    status: 'in-progress',
    dueDate: '2026-07-30'
  },
  {
    id: 't-4',
    title: 'Wire up filtering and search',
    description: 'Filter by status and search by title, combinable.',
    status: 'in-progress',
    dueDate: '2026-08-02'
  },
  {
    id: 't-5',
    title: 'Write unit tests',
    description: 'Cover the validation helper and the store actions.',
    status: 'pending',
    dueDate: '2026-08-10'
  },
  {
    id: 't-6',
    title: 'Prepare README',
    description: 'Document setup steps so a reviewer can run this in one go.',
    status: 'pending',
    dueDate: '2026-08-12'
  }
]
