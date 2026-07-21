import { defineStore } from 'pinia'
import type { Toast, ToastType } from '~/types/toast'

interface ToastState {
  toasts: Toast[]
}

function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useToastStore = defineStore('toast', {
  state: (): ToastState => ({
    toasts: []
  }),

  actions: {
    add(message: string, type: ToastType = 'success', duration: number = 3000) {
      const id = generateId()
      const toast: Toast = { id, type, message, duration }
      this.toasts.push(toast)

      if (duration > 0) {
        setTimeout(() => {
          this.remove(id)
        }, duration)
      }

      return id
    },

    success(message: string, duration?: number) {
      return this.add(message, 'success', duration)
    },

    error(message: string, duration?: number) {
      return this.add(message, 'error', duration)
    },

    remove(id: string) {
      const index = this.toasts.findIndex((t) => t.id === id)
      if (index !== -1) {
        this.toasts.splice(index, 1)
      }
    },

    clear() {
      this.toasts = []
    }
  }
})