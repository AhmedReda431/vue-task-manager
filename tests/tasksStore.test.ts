import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTasksStore } from '~/stores/tasks'

describe('useTasksStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('loads tasks and clears the loading state', async () => {
    const store = useTasksStore()
    expect(store.loading).toBe(false)

    const fetchPromise = store.fetchTasks()
    expect(store.loading).toBe(true)

    await fetchPromise
    expect(store.loading).toBe(false)
    expect(store.tasks.length).toBeGreaterThan(0)
  })

  it('filters tasks by status and search text together', async () => {
    const store = useTasksStore()
    await store.fetchTasks()

    store.setStatusFilter('done')
    expect(store.filteredTasks.every((task) => task.status === 'done')).toBe(true)

    store.setSearchQuery('zzz-no-match')
    expect(store.filteredTasks).toHaveLength(0)
  })

  it('adds a new task to the top of the list', async () => {
    const store = useTasksStore()
    await store.fetchTasks()
    const initialCount = store.tasks.length

    await store.addTask({
      title: 'New task',
      description: '',
      status: 'pending',
      dueDate: '2099-01-01'
    })

    expect(store.tasks).toHaveLength(initialCount + 1)
    expect(store.tasks[0].title).toBe('New task')
  })
})
