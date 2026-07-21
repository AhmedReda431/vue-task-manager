<script setup lang="ts">
const props = defineProps<{
  tagFilter: string;
  availableTags: string[];
}>();

const emit = defineEmits<{
  "update:searchQuery": [query: string];
  "update:tagFilter": [tag: string];
}>();

// Search is fully local — no prop binding
const localSearch = ref("");

// Tag syncs with prop (dropdown needs to reflect store state)
const localTag = ref(props.tagFilter);
watch(
  () => props.tagFilter,
  (val) => {
    localTag.value = val;
  },
);

let debounceTimer: ReturnType<typeof setTimeout>;

function onSearchInput() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit("update:searchQuery", localSearch.value);
  }, 400);
}

function clearSearch() {
  localSearch.value = "";
  emit("update:searchQuery", "");
}

function onTagChange() {
  emit("update:tagFilter", localTag.value);
}
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-3 mb-5">
    <!-- Search input -->
    <div class="relative flex-1">
      <div
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <svg
          class="h-4 w-4 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <input
        v-model="localSearch"
        type="text"
        placeholder="Search posts by title..."
        class="w-full rounded-xl border border-black/10 bg-white pl-10 pr-10 py-2.5 text-sm text-ink placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
        @input="onSearchInput"
      />
      <button
        v-if="localSearch"
        type="button"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        @click="clearSearch"
      >
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <!-- Tag filter dropdown -->
    <div class="relative sm:w-48">
      <select
        v-model="localTag"
        class="w-full appearance-none rounded-xl border border-black/10 bg-white px-4 py-2.5 pr-10 text-sm text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors cursor-pointer"
        @change="onTagChange"
      >
        <option value="">All tags</option>
        <option v-for="tag in availableTags" :key="tag" :value="tag">
          {{ tag }}
        </option>
      </select>
      <div
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <svg
          class="h-4 w-4 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  </div>
</template>
