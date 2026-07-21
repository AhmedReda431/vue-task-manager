<script setup lang="ts">
import type { PostDraft } from '~/types/post'

const route = useRoute()
const router = useRouter()
const store = usePostsStore()

const postId = computed(() => Number(route.params.id))

// Load post — either from store or fetch individually
const post = ref<Post | null>(null)
const loading = ref(true)

onMounted(async () => {
  // Try store first
  const fromStore = store.postById(postId.value)
  if (fromStore) {
    post.value = fromStore
    loading.value = false
    return
  }

  // Fetch individually if not in store (direct link/refresh)
  const fetched = await store.fetchSinglePost(postId.value)
  if (fetched) {
    post.value = fetched
  }
  loading.value = false
})

const isFormOpen = ref(false)
const submitting = ref(false)
const isDeleteOpen = ref(false)

async function handleSubmit(draft: PostDraft) {
  if (!post.value) return
  submitting.value = true
  try {
    await store.updatePost(post.value.id, draft)
    // Update local post data
    post.value = { ...post.value, ...draft }
    isFormOpen.value = false
  } finally {
    submitting.value = false
  }
}

async function confirmDelete() {
  if (!post.value) return
  await store.deletePost(post.value.id)
  router.push('/posts')
}
</script>

<template>
  <div class="min-h-screen bg-paper">
    <div class="mx-auto max-w-2xl px-4 py-10">
      <NuxtLink
        to="/posts"
        class="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-ink transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to posts
      </NuxtLink>

      <SharedLoadingState v-if="loading" />

      <div
        v-else-if="!post"
        class="rounded-xl bg-white p-6 text-center"
      >
        <p class="font-medium text-ink">Post not found.</p>
        <p class="mt-1 text-sm text-gray-500">It may have been deleted.</p>
      </div>

      <article
        v-else
        class="rounded-xl bg-white p-6"
      >
        <div class="mb-4 flex items-start justify-between gap-4">
          <h1 class="font-display text-2xl font-semibold text-ink">
            {{ post.title }}
          </h1>
        </div>

        <div class="mb-6 flex flex-wrap items-center gap-2">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
          >
            {{ tag }}
          </span>
        </div>

        <p class="mb-6 whitespace-pre-line text-sm leading-relaxed text-gray-600">
          {{ post.body }}
        </p>

        <div class="mb-6 flex items-center gap-6 text-sm text-gray-500">
          <span class="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {{ post.views.toLocaleString() }} views
          </span>
          <span class="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            {{ post.reactions.likes }} likes
          </span>
          <span class="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
            </svg>
            {{ post.reactions.dislikes }} dislikes
          </span>
        </div>

        <div class="flex gap-2">
          <button
            type="button"
            class="btn btn-primary px-4 py-2 text-sm"
            @click="isFormOpen = true"
          >
            Edit post
          </button>
          <button
            type="button"
            class="btn rounded-md border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            @click="isDeleteOpen = true"
          >
            Delete post
          </button>
        </div>
      </article>

      <SharedModalDialog
        v-if="isFormOpen && post"
        title="Edit post"
        @close="isFormOpen = false"
      >
        <PostsPostForm
          :post="post"
          :submitting="submitting"
          @submit="handleSubmit"
          @cancel="isFormOpen = false"
        />
      </SharedModalDialog>

      <SharedConfirmDialog
        v-if="isDeleteOpen"
        title="Delete post?"
        message="This can't be undone."
        confirm-label="Delete"
        danger
        @confirm="confirmDelete"
        @cancel="isDeleteOpen = false"
      />
    </div>
  </div>
</template>