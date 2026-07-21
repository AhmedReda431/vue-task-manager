<script setup lang="ts">
const store = usePostsStore()

const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

function observeSentinel() {
  if (!observer || !sentinel.value) return
  observer.disconnect()
  observer.observe(sentinel.value)
}

onMounted(async () => {
  if (store.posts.length === 0) {
    await store.fetchPage(1)
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting && store.mode === 'scroll') {
        store.fetchNextPage()
      }
    },
    { rootMargin: '200px' }
  )

  await nextTick()
  observeSentinel()
})

watch(sentinel, async () => {
  await nextTick()
  observeSentinel()
})

watch(
  () => store.mode,
  async (mode) => {
    if (mode !== 'scroll') return
    await nextTick()
    observeSentinel()
  }
)

onUnmounted(() => {
  observer?.disconnect()
})

function goToPage(page: number) {
  if (page < 1 || page > store.totalPages || page === store.page) return
  window.scrollTo({ top: 0, behavior: 'smooth' })
  store.fetchPage(page)
}
</script>

<template>
  <div class="min-h-screen bg-paper">
    <div class="mx-auto max-w-2xl px-4 py-10">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="font-display text-4xl font-semibold text-ink">Posts</h1>
        <p class="mt-2 text-sm text-ink/70">
          Pulled live from dummyjson. Choose your preferred pagination experience below.
        </p>
        <small class="text-white p-2 mt-2 inline-block capitalize bg-red-500">
          This supplemental guide demonstrates how to retrieve tasks (posts) from the endpoint.
        </small>
      </div>

      <!-- Pagination Mode -->
      <div class="mb-8 inline-flex rounded-full border border-black/10 bg-white p-1 shadow-sm">
        <button
          type="button"
          class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-300"
          :class="store.mode === 'buttons' ? 'bg-accent text-paper shadow' : 'text-ink hover:text-accent'"
          @click="store.setMode('buttons')"
        >
          Page Buttons
        </button>
        <button
          type="button"
          class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-300"
          :class="store.mode === 'scroll' ? 'bg-accent text-paper shadow' : 'text-ink hover:text-accent'"
          @click="store.setMode('scroll')"
        >
          Infinite Scroll
        </button>
      </div>

      <!-- Loading -->
      <LoadingState v-if="store.loading" />

      <!-- Error -->
      <ErrorState
        v-else-if="store.error"
        :message="store.error"
        @retry="() => store.fetchPage(store.page)"
      />

      <template v-else>
        <!-- Posts -->
        <div class="space-y-4">
          <PostCard v-for="post in store.posts" :key="post.id" :post="post" />
        </div>

        <!-- Pagination Buttons -->
        <PaginationControls
          v-if="store.mode === 'buttons'"
          :current-page="store.page"
          :total-pages="store.totalPages"
          :show-info="false"
          @change="goToPage"
          
        />

        <!-- Infinite Scroll -->
        <div v-else ref="sentinel" class="flex justify-center py-8">
          <PaginationControls
            mode="scroll"
            :loading-more="store.loadingMore"
            :has-more="store.hasMore"
          />
        </div>
      </template>
    </div>
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