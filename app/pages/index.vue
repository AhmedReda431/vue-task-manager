<script setup lang="ts">
import type { Task, TaskDraft } from '~/types/task'

const store = useTasksStore()

// Fetch once on first load. In dev this re-runs on hot reload, which is
// fine since it's just re-populating from the mock data.
onMounted(() => {
  store.fetchTasks()
})

const isFormOpen = ref(false)
const editingTask = ref<Task | undefined>(undefined)
const submitting = ref(false)
const deleteTargetId = ref<string | null>(null)

function openAddForm() {
  editingTask.value = undefined
  isFormOpen.value = true
}

function openEditForm(task: Task) {
  editingTask.value = task
  isFormOpen.value = true
}

function closeForm() {
  isFormOpen.value = false
  editingTask.value = undefined
}

async function handleSubmit(draft: TaskDraft) {
  submitting.value = true
  try {
    if (editingTask.value) {
      await store.updateTask(editingTask.value.id, draft)
    } else {
      await store.addTask(draft)
    }
    closeForm()
  } finally {
    submitting.value = false
  }
}

function requestDelete(id: string) {
  deleteTargetId.value = id
}

async function confirmDelete() {
  if (!deleteTargetId.value) return
  await store.deleteTask(deleteTargetId.value)
  deleteTargetId.value = null
}
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-10">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="font-display text-2xl font-semibold text-ink">Tasks</h1>
        <p class="mt-1 text-sm text-slate-500">{{ store.filteredTasks.length }} of {{ store.tasks.length }} shown</p>
      </div>
      <button type="button" class="btn btn-primary px-4 py-2 text-sm" @click="openAddForm">
        + Add task
      </button>
    </div>

    <TaskFilters
      class="mb-5"
      :status-filter="store.statusFilter"
      :search-query="store.searchQuery"
      @update:status-filter="store.setStatusFilter"
      @update:search-query="store.setSearchQuery"
    />

    <LoadingState v-if="store.loading" />
    <ErrorState v-else-if="store.error" :message="store.error" @retry="store.fetchTasks" />
    <EmptyState v-else-if="store.filteredTasks.length === 0" :has-tasks="store.tasks.length > 0" />

    <TransitionGroup v-else tag="div" name="list" class="space-y-3">
      <TaskCard
        v-for="task in store.filteredTasks"
        :key="task.id"
        :task="task"
        @edit="openEditForm"
        @delete="requestDelete"
      />
    </TransitionGroup>

    <ModalDialog v-if="isFormOpen" :title="editingTask ? 'Edit task' : 'Add task'" @close="closeForm">
      <TaskForm :task="editingTask" :submitting="submitting" @submit="handleSubmit" @cancel="closeForm" />
    </ModalDialog>

    <ConfirmDialog
      v-if="deleteTargetId"
      title="Delete task?"
      message="This can't be undone."
      confirm-label="Delete"
      danger
      @confirm="confirmDelete"
      @cancel="deleteTargetId = null"
    />
  </div>
</template>

<style scoped lang="scss">
.list-enter-active,
.list-leave-active {
  transition: opacity 0.15s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}
</style>
