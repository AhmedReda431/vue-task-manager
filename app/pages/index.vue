<script setup lang="ts">
import type { Task, TaskDraft } from '~/types/task'

const store = useTasksStore()

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

async function handlePageChange(page: number) {
  await store.setPage(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-10">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="font-display text-2xl font-semibold text-ink dark:text-paper">
          Tasks
        </h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {{ store.totalFilteredCount }} total
        </p>
      </div>
      <button
        type="button"
        class="btn btn-primary px-4 py-2 text-sm"
        @click="openAddForm"
      >
        + Add task
      </button>
    </div>

    <!-- Filters -->
    <TasksTaskFilters
      class="mb-5"
      :status-filter="store.statusFilter"
      :search-query="store.searchQuery"
      @update:status-filter="store.setStatusFilter"
      @update:search-query="store.setSearchQuery"
    />

    <!-- Initial Loading -->
    <SharedLoadingState v-if="store.loading" />

    <!-- Error -->
    <SharedErrorState
      v-else-if="store.error"
      :message="store.error"
      @retry="store.fetchTasks"
    />

    <!-- Empty -->
    <SharedEmptyState
      v-else-if="store.filteredTasks.length === 0"
      :has-tasks="store.tasks.length > 0"
    />

    <!-- Content -->
    <template v-else>
      <!-- Page transition loading -->
      <SharedLoadingState v-if="store.pageLoading" />

      <!-- Task list -->
      <TransitionGroup
        v-else
        tag="div"
        name="list"
        class="space-y-3"
      >
        <TasksTaskCard
          v-for="task in store.paginatedTasks"
          :key="task.id"
          :task="task"
          @edit="openEditForm"
          @delete="requestDelete"
        />
      </TransitionGroup>

      <!-- Pagination -->
      <SharedPaginationControls
        :current-page="store.currentPage"
        :total-pages="store.totalPages"
        :showing-from="store.showingFrom"
        :showing-to="store.showingTo"
        :total-count="store.totalFilteredCount"
        @change="handlePageChange"
        v-if="!store?.loading && !store?.pageLoading"
      />
    </template>

    <!-- Modals -->
    <SharedModalDialog
      v-if="isFormOpen"
      :title="editingTask ? 'Edit task' : 'Add task'"
      @close="closeForm"
    >
      <TasksTaskForm
        :task="editingTask"
        :submitting="submitting"
        @submit="handleSubmit"
        @cancel="closeForm"
      />
    </SharedModalDialog>

    <SharedConfirmDialog
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