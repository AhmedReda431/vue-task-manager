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

// Edit / Delete handlers
const editingPost = ref<Post | null>(null)
const isFormOpen = ref(false)
const submitting = ref(false)
const deleteTargetId = ref<number | null>(null)

function openEditForm(post: Post) {
  editingPost.value = post
  isFormOpen.value = true
}

function closeForm() {
  isFormOpen.value = false
  editingPost.value = null
}

async function handleSubmit(draft: PostDraft) {
  if (!editingPost.value) return
  submitting.value = true
  try {
    await store.updatePost(editingPost.value.id, draft)
    closeForm()
  } finally {
    submitting.value = false
  }
}

function requestDelete(id: number) {
  deleteTargetId.value = id
}

async function confirmDelete() {
  if (!deleteTargetId.value) return
  await store.deletePost(deleteTargetId.value)
  deleteTargetId.value = null
}

// Debounced search
let searchDebounce: ReturnType<typeof setTimeout>
function handleSearch(query: string) {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    store.setSearchQuery(query)
  }, 400)
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
      </div>

      <!-- Pagination Mode Toggle -->
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

      <!-- Search & Filter -->
      <PostFilters
        :search-query="store.searchQuery"
        :tag-filter="store.tagFilter"
        :available-tags="store.availableTags"
        @update:search-query="handleSearch"
        @update:tag-filter="store.setTagFilter"
      />

      <!-- Active filters indicator -->
      <div class="mb-4 flex flex-wrap items-center gap-2">
        <p class="text-sm text-ink/60">
          <span v-if="store.tagFilter && store.searchQuery.trim()">
            {{ store.filteredPosts.length }} of {{ store.total }} posts
          </span>
          <span v-else>
            {{ store.total }} posts
          </span>
          <template v-if="store.tagFilter || store.searchQuery">
            <span>filtered by</span>
            <span v-if="store.tagFilter" class="font-semibold text-accent"> tag:{{ store.tagFilter }}</span>
            <span v-if="store.tagFilter && store.searchQuery.trim()"> + </span>
            <span v-if="store.searchQuery.trim()" class="font-semibold text-accent"> search:"{{ store.searchQuery }}"</span>
          </template>
        </p>
        <button
          v-if="store.tagFilter || store.searchQuery"
          type="button"
          class="text-xs text-red-500 hover:text-red-700 hover:underline"
          @click="store.clearFilters()"
        >
          Clear all
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
        <!-- Posts List -->
        <div v-if="store.filteredPosts.length > 0" class="space-y-4">
          <PostCard
            v-for="post in store.filteredPosts"
            :key="post.id"
            :post="post"
            @edit="openEditForm"
            @delete="requestDelete"
          />
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="rounded-xl bg-white p-8 text-center"
        >
          <p class="text-ink/70 font-medium">No posts found</p>
          <p class="mt-1 text-sm text-ink/50">
            Try adjusting your search or filter
          </p>
        </div>

        <!-- Pagination: Buttons Mode -->
        <PaginationControls
          v-if="store.mode === 'buttons' && !(store.tagFilter && store.searchQuery.trim())"
          :current-page="store.page"
          :total-pages="store.totalPages"
          :show-info="false"
          @change="goToPage"
        />

        <!-- Pagination: Infinite Scroll Mode -->
        <div v-else-if="store.mode === 'scroll'" ref="sentinel" class="flex justify-center py-8">
          <PaginationControls
            mode="scroll"
            :loading-more="store.loadingMore"
            :has-more="store.hasMore"
          />
        </div>
      </template>
    </div>

    <!-- Edit Modal -->
    <ModalDialog
      v-if="isFormOpen && editingPost"
      title="Edit post"
      @close="closeForm"
    >
      <PostForm
        :post="editingPost"
        :submitting="submitting"
        @submit="handleSubmit"
        @cancel="closeForm"
      />
    </ModalDialog>

    <!-- Delete Confirm -->
    <ConfirmDialog
      v-if="deleteTargetId"
      title="Delete post?"
      message="This can't be undone."
      confirm-label="Delete"
      danger
      @confirm="confirmDelete"
      @cancel="deleteTargetId = null"
    />
  </div>
</template>