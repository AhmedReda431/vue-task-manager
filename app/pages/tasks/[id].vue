<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const store = useTasksStore()

// If someone lands here directly (refresh, shared link) the store may be
// empty, so make sure the data is loaded before looking the task up.
onMounted(async () => {
  if (store.tasks.length === 0) {
    await store.fetchTasks()
  }
})

const task = computed(() => store.taskById(route.params.id as string))

const formattedDueDate = computed(() => {
  if (!task.value) return ''
  return new Date(task.value.dueDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
})

async function handleDelete() {
  if (!task.value) return
  const confirmed = confirm('Delete this task? This can\'t be undone.')
  if (!confirmed) return
  await store.deleteTask(task.value.id)
  router.push('/')
}
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-10">
    <NuxtLink to="/" class="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
      &larr; Back to tasks
    </NuxtLink>

    <LoadingState v-if="store.loading" />

    <div v-else-if="!task" class="rounded-lg border border-black/5 bg-white p-6 text-center">
      <p class="font-medium text-slate-700">Task not found.</p>
      <p class="mt-1 text-sm text-slate-500">It may have been deleted.</p>
    </div>

    <article v-else class="rounded-lg border border-black/5 bg-white p-6">
      <div class="mb-4 flex items-start justify-between gap-4">
        <h1 class="text-xl font-semibold text-[#1c2530]">{{ task.title }}</h1>
        <StatusBadge :status="task.status" />
      </div>

      <p v-if="task.description" class="mb-6 whitespace-pre-line text-sm leading-relaxed text-slate-600">
        {{ task.description }}
      </p>
      <p v-else class="mb-6 text-sm italic text-slate-400">No description.</p>

      <div class="mb-6 flex items-center gap-1.5 text-sm text-slate-500">
        <span class="font-medium text-slate-700">Due:</span> {{ formattedDueDate }}
      </div>

      <button type="button" class="btn rounded-md border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50" @click="handleDelete">
        Delete task
      </button>
    </article>
  </div>
</template>
