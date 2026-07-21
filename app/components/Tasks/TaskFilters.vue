<script setup lang="ts">
import { TASK_STATUSES } from "~/types/task";
import type { TaskStatus } from "~/types/task";

const props = defineProps<{
  statusFilter: TaskStatus | "all";
  searchQuery: string;
}>();

const emit = defineEmits<{
  "update:statusFilter": [value: TaskStatus | "all"];
  "update:searchQuery": [value: string];
}>();
const handleClear = () => {
  emit("update:searchQuery", "");
};
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
    <div class="relative flex-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      >
        <path
          fill-rule="evenodd"
          d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
          clip-rule="evenodd"
        />
      </svg>
      <input
        :value="searchQuery"
        type="text"
        placeholder="Search tasks by title..."
        class="btn w-full rounded-md border border-black/10 bg-white py-2 pl-9 pr-3 text-sm focus:border-[#3b6e64]"
        @input="
          emit('update:searchQuery', ($event.target as HTMLInputElement).value)
        "
      />
      <!-- Clear Button (Right) -->
      <button
        v-if="searchQuery"
        type="button"
        @click="handleClear"
        class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
        aria-label="Clear search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="h-4 w-4"
        >
          <path
            d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
          />
        </svg>
      </button>
    </div>

    <select
      :value="statusFilter"
      class="btn rounded-md border border-black/10 bg-white py-2 px-3 text-sm focus:border-[#3b6e64]"
      @change="
        emit(
          'update:statusFilter',
          ($event.target as HTMLSelectElement).value as TaskStatus | 'all',
        )
      "
    >
      <option value="all">All statuses</option>
      <option
        v-for="status in TASK_STATUSES"
        :key="status.value"
        :value="status.value"
      >
        {{ status.label }}
      </option>
    </select>
  </div>
</template>
