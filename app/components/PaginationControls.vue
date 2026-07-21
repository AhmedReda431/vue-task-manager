<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    currentPage: number
    totalPages: number
    showingFrom?: number
    showingTo?: number
    totalCount?: number
    showInfo?: boolean
    mode?: 'buttons' | 'scroll'
    loadingMore?: boolean
    hasMore?: boolean
  }>(),
  {
    showInfo: true,
    mode: 'buttons',
    showingFrom: 0,
    showingTo: 0,
    totalCount: 0,
    loadingMore: false,
    hasMore: true
  }
)

const emit = defineEmits<{
  change: [page: number]
}>()

function goToPage(page: number) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit('change', page)
}

const paginationItems = computed(() => {
  const current = props.currentPage
  const total = props.totalPages

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const items: (number | string)[] = []
  items.push(1)

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) items.push('...')

  for (let i = start; i <= end; i++) {
    items.push(i)
  }

  if (end < total - 1) items.push('...')

  items.push(total)
  return items
})
</script>

<template>
  <!-- Buttons mode -->
  <div
    v-if="mode === 'buttons'"
    class="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4"
  >
    <!-- Info text -->
    <div
      v-if="showInfo"
      class="text-sm text-ink/70"
    >
      Showing
      <span class="font-semibold text-ink">{{ showingFrom }}</span>
      to
      <span class="font-semibold text-ink">{{ showingTo }}</span>
      of
      <span class="font-semibold text-ink">{{ totalCount }}</span>
      tasks
    </div>
    <div v-else />

    <!-- Controls -->
    <div class="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="goToPage(1)"
      >
        First
      </button>

      <button
        type="button"
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        ←
      </button>

      <template
        v-for="(item, index) in paginationItems"
        :key="`${item}-${index}`"
      >
        <span
          v-if="item === '...'"
          class="px-2 font-semibold text-accent"
        >
          •••
        </span>

        <button
          v-else
          type="button"
          class="pagination-btn page-number"
          :class="{ active: item === currentPage }"
          @click="goToPage(item as number)"
        >
          {{ item }}
        </button>
      </template>

      <button
        type="button"
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        →
      </button>

      <button
        type="button"
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="goToPage(totalPages)"
      >
        Last
      </button>
    </div>
  </div>

  <!-- Scroll mode -->
  <div
    v-else
    class="flex justify-center py-8"
  >
    <div
      v-if="loadingMore"
      class="mt-6 flex flex-col items-center gap-3 py-6"
    >
      <Spinner size="md" class="text-accent" />
      <p class="text-sm text-ink/70">Loading more posts...</p>
    </div>

    <p v-else-if="!hasMore" class="text-sm text-ink/60">
      You've reached the end.
    </p>
  </div>
</template>

<style scoped>
.pagination-btn {
  @apply flex h-11 min-w-[44px] items-center justify-center rounded-xl border border-black/10 bg-white px-4 text-sm font-medium text-ink transition-all duration-300;
}

.pagination-btn:hover:not(:disabled) {
  @apply border-accent bg-accent/10 text-accent shadow-md;
  transform: translateY(-2px);
}

.pagination-btn:active:not(:disabled) {
  transform: scale(0.96);
}

.pagination-btn:disabled {
  @apply cursor-not-allowed opacity-40;
}

.page-number {
  @apply w-11 px-0;
}

.page-number.active {
  @apply border-accent bg-accent text-paper;
  box-shadow:
    0 8px 20px rgba(47, 111, 98, 0.22),
    0 0 0 2px #043002;
}

.page-number.active:hover {
  @apply bg-accent-dark text-paper;
}
</style>