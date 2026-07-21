<script setup lang="ts">
import type { TaskStatus } from '~/types/task'

defineProps<{
  status: TaskStatus
}>()

const labels: Record<TaskStatus, string> = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  done: 'Done'
}
</script>

<template>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium">
    <span class="h-1.5 w-1.5 rounded-full" :class="`status-dot--${status}`" />
    <span :class="`status-text--${status}`">{{ labels[status] }}</span>
  </span>
</template>
