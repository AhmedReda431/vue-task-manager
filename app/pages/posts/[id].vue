<script setup lang="ts">
import type { TaskDraft } from "~/types/task";

const route = useRoute();
const router = useRouter();
const store = useTasksStore();

// If someone lands here directly (refresh, shared link) the store may be
// empty, so make sure the data is loaded before looking the task up.
onMounted(async () => {
  if (store.tasks.length === 0) {
    await store.fetchTasks();
  }
});

const task = computed(() => store.taskById(route.params.id as string));

const formattedDueDate = computed(() => {
  if (!task.value) return "";
  return new Date(task.value.dueDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
});

const isFormOpen = ref(false);
const submitting = ref(false);
const isDeleteOpen = ref(false);

async function handleSubmit(draft: TaskDraft) {
  if (!task.value) return;
  submitting.value = true;
  try {
    await store.updateTask(task.value.id, draft);
    isFormOpen.value = false;
  } finally {
    submitting.value = false;
  }
}

async function confirmDelete() {
  if (!task.value) return;
  await store.deleteTask(task.value.id);
  router.push("/");
}
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-10">
    <NuxtLink
      to="/"
      class="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
    >
      &larr; Back to tasks
    </NuxtLink>

    <LoadingState v-if="store.loading" />

    <div
      v-else-if="!task"
      class="rounded-xl bg-white p-6 text-center task-card"
    >
      <p class="font-medium text-slate-700">Task not found.</p>
      <p class="mt-1 text-sm text-slate-500">It may have been deleted.</p>
    </div>

    <article
      v-else
      class="task-card rounded-xl bg-white p-6"
      :class="`task-card--${task.status}`"
    >
      <div class="mb-4 flex items-start justify-between gap-4">
        <h1 class="font-display text-xl font-semibold text-ink">
          {{ task.title }}
        </h1>
        <StatusBadge :status="task.status" />
      </div>

      <p
        v-if="task.description"
        class="mb-6 whitespace-pre-line text-sm leading-relaxed text-slate-600"
      >
        {{ task.description }}
      </p>
      <p v-else class="mb-6 text-sm italic text-slate-400">No description.</p>

      <div class="mb-6 flex items-center gap-1.5 text-sm text-slate-500">
        <span class="font-medium text-slate-700">Due:</span>
        {{ formattedDueDate }}
      </div>

      <div class="flex gap-2">
        <button
          type="button"
          class="btn btn-primary px-4 py-2 text-sm"
          @click="isFormOpen = true"
        >
          Edit task
        </button>
        <button
          type="button"
          class="btn rounded-md border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          @click="isDeleteOpen = true"
        >
          Delete task
        </button>
      </div>
    </article>

    <ModalDialog
      v-if="isFormOpen && task"
      title="Edit task"
      @close="isFormOpen = false"
    >
      <TaskForm
        :task="task"
        :submitting="submitting"
        @submit="handleSubmit"
        @cancel="isFormOpen = false"
      />
    </ModalDialog>

    <ConfirmDialog
      v-if="isDeleteOpen"
      title="Delete task?"
      message="This can't be undone."
      confirm-label="Delete"
      danger
      @confirm="confirmDelete"
      @cancel="isDeleteOpen = false"
    />
  </div>
</template>
