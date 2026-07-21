import { defineStore } from 'pinia'
import type { Task, TaskDraft, TaskStatus } from '~/types/task'
import { MOCK_TASKS } from '~/utils/mockTasks'

interface TasksState {
  tasks: Task[]
  loading: boolean
  error: string | null
  statusFilter: TaskStatus | 'all'
  searchQuery: string
}

// Small helper so we don't repeat the same setTimeout-wrapped-in-a-promise
// pattern in every action below.
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const useTasksStore = defineStore('tasks', {
  state: (): TasksState => ({
    tasks: [],
    loading: false,
    error: null,
    statusFilter: 'all',
    searchQuery: ''
  }),

  getters: {
    filteredTasks(state): Task[] {
      const query = state.searchQuery.trim().toLowerCase()

      return state.tasks.filter((task) => {
        const matchesStatus = state.statusFilter === 'all' || task.status === state.statusFilter
        const matchesSearch = !query || task.title.toLowerCase().includes(query)
        return matchesStatus && matchesSearch
      })
    },

    taskById(state) {
      return (id: string) => state.tasks.find((task) => task.id === id)
    }
  },

  actions: {
    // Simulates fetching the initial task list from a server. In a real
    // app this would be a $fetch('/api/tasks') call - swapping it out
    // later only means changing this one action.
    async fetchTasks() {
      this.loading = true
      this.error = null

      try {
        await delay(600)

        // Uncomment to see the error state during development:
        // throw new Error('Network error')

        this.tasks = MOCK_TASKS.map((task) => ({ ...task }))
      } catch (err) {
        this.error = 'Could not load tasks. Please try again.'
      } finally {
        this.loading = false
      }
    },

    async addTask(draft: TaskDraft) {
      await delay(300)
      const newTask: Task = {
        id: `t-${Date.now()}`,
        ...draft
      }
      this.tasks.unshift(newTask)
      return newTask
    },

    async updateTask(id: string, draft: TaskDraft) {
      await delay(300)
      const index = this.tasks.findIndex((task) => task.id === id)
      if (index === -1) return

      this.tasks[index] = { id, ...draft }
    },

    async deleteTask(id: string) {
      await delay(300)
      this.tasks = this.tasks.filter((task) => task.id !== id)
    },

    setStatusFilter(status: TaskStatus | 'all') {
      this.statusFilter = status
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
    }
  }
})
