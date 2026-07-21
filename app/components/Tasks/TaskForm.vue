<script setup lang="ts">
import type { Task, TaskDraft } from '~/types/task'
import { TASK_STATUSES } from '~/types/task'
import { validateTask, isValid } from '~/utils/validateTask'

const props = defineProps<{
  // When editing, pass the existing task; leave undefined to add a new one.
  task?: Task
  submitting?: boolean
}>()

const emit = defineEmits<{
  submit: [draft: TaskDraft]
  cancel: []
}>()

const form = reactive<TaskDraft>({
  title: props.task?.title ?? '',
  description: props.task?.description ?? '',
  status: props.task?.status ?? 'pending',
  dueDate: props.task?.dueDate ?? ''
})

const errors = ref<ReturnType<typeof validateTask>>({})
const touched = ref(false)

function handleSubmit() {
  touched.value = true
  errors.value = validateTask(form)

  if (!isValid(errors.value)) return

  emit('submit', { ...form })
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div>
      <label for="title" class="mb-1 block text-sm font-medium text-slate-700">Title</label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        class="btn w-full rounded-md border px-3 py-2 text-sm"
        :class="touched && errors.title ? 'border-red-400' : 'border-black/10'"
        placeholder="e.g. Write the onboarding guide"
      />
      <p v-if="touched && errors.title" class="mt-1 text-xs text-red-600">{{ errors.title }}</p>
    </div>

    <div>
      <label for="description" class="mb-1 block text-sm font-medium text-slate-700">Description</label>
      <textarea
        id="description"
        v-model="form.description"
        rows="3"
        class="btn w-full rounded-md border border-black/10 px-3 py-2 text-sm"
        placeholder="Optional details..."
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="status" class="mb-1 block text-sm font-medium text-slate-700">Status</label>
        <select id="status" v-model="form.status" class="btn w-full rounded-md border border-black/10 px-3 py-2 text-sm">
          <option v-for="status in TASK_STATUSES" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>

      <div>
        <label for="dueDate" class="mb-1 block text-sm font-medium text-slate-700">Due date</label>
        <input
          id="dueDate"
          v-model="form.dueDate"
          type="date"
          class="btn w-full rounded-md border px-3 py-2 text-sm"
          :class="touched && errors.dueDate ? 'border-red-400' : 'border-black/10'"
        />
        <p v-if="touched && errors.dueDate" class="mt-1 text-xs text-red-600">{{ errors.dueDate }}</p>
      </div>
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <button type="button" class="btn rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-black/5" @click="emit('cancel')">
        Cancel
      </button>
      <button type="submit" class="btn btn-primary px-4 py-2 text-sm" :disabled="submitting">
        {{ submitting ? 'Saving...' : task ? 'Save changes' : 'Add task' }}
      </button>
    </div>
  </form>
</template>
