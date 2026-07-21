<script setup lang="ts">
import type { Task } from '~/types/task'

const props = defineProps<{
  task: Task
}>()

defineEmits<{
  edit: [task: Task]
  delete: [id: string]
}>()

// "Aug 2, 2026" reads better in a list than a raw ISO string.
const formattedDueDate = computed(() =>
  new Date(props.task.dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
)

const isOverdue = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return props.task.status !== 'done' && new Date(props.task.dueDate) < today
})
</script>

<template>
  <article
    class="task-card-enter group rounded-lg border border-black/5 bg-white p-4 transition-shadow hover:shadow-md"
  >
    <div class="flex items-start justify-between gap-3">
      <NuxtLink :to="`/tasks/${task.id}`" class="min-w-0 flex-1">
        <h3 class="truncate font-medium text-[#1c2530] group-hover:underline">
          {{ task.title }}
        </h3>
        <p v-if="task.description" class="mt-1 line-clamp-2 text-sm text-slate-500">
          {{ task.description }}
        </p>
      </NuxtLink>

      <div class="flex shrink-0 gap-1">
        <button
          type="button"
          class="btn rounded-md p-1.5 text-slate-400 hover:bg-black/5 hover:text-slate-700"
          aria-label="Edit task"
          @click="$emit('edit', task)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
            <path
              d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-8.5 8.5a2 2 0 0 1-.878.507l-3 .857a.5.5 0 0 1-.618-.618l.857-3a2 2 0 0 1 .507-.878l8.5-8.5z"
            />
          </svg>
        </button>
        <button
          type="button"
          class="btn rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
          aria-label="Delete task"
          @click="$emit('delete', task.id)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
            <path
              fill-rule="evenodd"
              d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482 41.03 41.03 0 0 0-2.365-.298V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="mt-3 flex items-center justify-between">
      <StatusBadge :status="task.status" />
      <span class="text-xs" :class="isOverdue ? 'font-medium text-red-600' : 'text-slate-400'">
        Due {{ formattedDueDate }}
      </span>
    </div>
  </article>
</template>
