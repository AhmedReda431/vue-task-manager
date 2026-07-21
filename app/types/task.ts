export type TaskStatus = 'pending' | 'in-progress' | 'done'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  dueDate: string // ISO date string, e.g. "2026-08-01"
}

// Shape used by the add/edit form - same as Task but without the id,
// since that gets generated (or is already known) elsewhere.
export type TaskDraft = Omit<Task, 'id'>

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' }
]
