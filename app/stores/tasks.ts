import { defineStore } from 'pinia'
import type { Task, TaskDraft, TaskStatus } from '~/types/task'
import { MOCK_TASKS } from '~/utils/mockTasks'
import { useToastStore } from '~/stores/toast'

interface TasksState {
  tasks: Task[]
  loading: boolean
  error: string | null
  statusFilter: TaskStatus | 'all'
  searchQuery: string
  currentPage: number
  pageSize: number
  pageLoading: boolean
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const useTasksStore = defineStore('tasks', {
  state: (): TasksState => ({
    tasks: [],
    loading: false,
    error: null,
    statusFilter: 'all',
    searchQuery: '',
    currentPage: 1,
    pageSize: 10,
    pageLoading: false
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

    totalFilteredCount(state): number {
      return this.filteredTasks.length
    },

    totalPages(): number {
      return Math.max(1, Math.ceil(this.totalFilteredCount / this.pageSize))
    },

    paginatedTasks(): Task[] {
      const filtered = this.filteredTasks
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return filtered.slice(start, end)
    },

    showingFrom(): number {
      if (this.totalFilteredCount === 0) return 0
      return (this.currentPage - 1) * this.pageSize + 1
    },

    showingTo(): number {
      return Math.min(this.currentPage * this.pageSize, this.totalFilteredCount)
    },

    taskById(state) {
      return (id: string) => state.tasks.find((task) => task.id === id)
    }
  },

  actions: {
    async fetchTasks() {
      this.loading = true
      this.error = null
      try {
        await delay(600)
        this.tasks = MOCK_TASKS.map((task) => ({ ...task }))
        this.currentPage = 1
      } catch (err) {
        this.error = 'Could not load tasks. Please try again.'
      } finally {
        this.loading = false
      }
    },

    async addTask(draft: TaskDraft) {
      const toast = useToastStore()
      await delay(300)
      const newTask: Task = {
        id: `t-${Date.now()}`,
        ...draft
      }
      this.tasks.unshift(newTask)
      this.currentPage = 1
      toast.success('Task created successfully')
      return newTask
    },

    async updateTask(id: string, draft: TaskDraft) {
      const toast = useToastStore()
      await delay(300)
      const index = this.tasks.findIndex((task) => task.id === id)
      if (index === -1) {
        toast.error('Task not found')
        return
      }
      this.tasks[index] = { id, ...draft }
      toast.success('Task updated successfully')
    },

    async deleteTask(id: string) {
      const toast = useToastStore()
      await delay(300)
      this.tasks = this.tasks.filter((task) => task.id !== id)
      if (this.currentPage > this.totalPages) {
        this.currentPage = Math.max(1, this.totalPages)
      }
      toast.success('Task deleted successfully')
    },

    setStatusFilter(status: TaskStatus | 'all') {
      this.statusFilter = status
      this.currentPage = 1
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
      this.currentPage = 1
    },

    async setPage(page: number) {
      if (page === this.currentPage) return
      this.pageLoading = true
      await delay(400)
      this.currentPage = page
      this.pageLoading = false
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.setPage(this.currentPage + 1)
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.setPage(this.currentPage - 1)
      }
    }
  }
})