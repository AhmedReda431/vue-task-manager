import type { TaskDraft } from '~/types/task'

export interface ValidationErrors {
  title?: string
  dueDate?: string
}

/**
 * Validates a task draft before it's saved.
 * Rules from the task brief: title is required, due date must be in the future.
 */
export function validateTask(draft: Partial<TaskDraft>): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!draft.title || !draft.title.trim()) {
    errors.title = 'Title is required.'
  }

  if (!draft.dueDate) {
    errors.dueDate = 'Due date is required.'
  } else {
    // Compare against the start of today so "today" doesn't get rejected
    // by a few hours of time-of-day drift.
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(draft.dueDate)

    if (Number.isNaN(due.getTime())) {
      errors.dueDate = 'Enter a valid date.'
    } else if (due < today) {
      errors.dueDate = 'Due date must be in the future.'
    }
  }

  return errors
}

export function isValid(errors: ValidationErrors): boolean {
  return Object.keys(errors).length === 0
}
