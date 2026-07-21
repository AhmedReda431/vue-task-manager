import { describe, it, expect } from 'vitest'
import { validateTask, isValid } from '~/utils/validateTask'

describe('validateTask', () => {
  it('requires a title', () => {
    const errors = validateTask({ title: '', dueDate: '2099-01-01' })
    expect(errors.title).toBeDefined()
    expect(isValid(errors)).toBe(false)
  })

  it('rejects a due date in the past', () => {
    const errors = validateTask({ title: 'Ship the release', dueDate: '2000-01-01' })
    expect(errors.dueDate).toBeDefined()
    expect(isValid(errors)).toBe(false)
  })

  it('passes with a title and a future due date', () => {
    const errors = validateTask({ title: 'Ship the release', dueDate: '2099-01-01' })
    expect(isValid(errors)).toBe(true)
  })
})
