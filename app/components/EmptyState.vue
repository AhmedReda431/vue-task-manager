<script setup lang="ts">
defineProps<{
  hasTasks: boolean
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-1 py-16 text-center">
    <p class="text-sm font-medium text-slate-600">
      {{ hasTasks ? 'No tasks match your filters.' : 'No tasks yet.' }}
    </p>
    <p class="text-sm text-slate-400">
      {{ hasTasks ? 'Try clearing the search or status filter.' : 'Add your first task to get started.' }}
    </p>
  </div>
</template>
