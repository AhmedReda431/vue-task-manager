<script setup lang="ts">
import type { Post, PostDraft } from '~/types/post'

const props = defineProps<{
  post?: Post
  submitting?: boolean
}>()

const emit = defineEmits<{
  submit: [draft: PostDraft]
  cancel: []
}>()

const title = ref(props.post?.title ?? '')
const body = ref(props.post?.body ?? '')
const tags = ref(props.post?.tags?.join(', ') ?? '')

const isValid = computed(() => title.value.trim().length > 0 && body.value.trim().length > 0)

function handleSubmit() {
  if (!isValid.value) return
  emit('submit', {
    title: title.value.trim(),
    body: body.value.trim(),
    userId: props.post?.userId ?? 1,
    tags: tags.value.split(',').map((t) => t.trim()).filter(Boolean)
  })
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div>
      <label class="mb-1 block text-sm font-medium text-ink">Title</label>
      <input
        v-model="title"
        type="text"
        class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        placeholder="Post title"
        required
      />
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-ink">Body</label>
      <textarea
        v-model="body"
        rows="5"
        class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        placeholder="Post content"
        required
      />
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-ink">Tags (comma separated)</label>
      <input
        v-model="tags"
        type="text"
        class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        placeholder="tag1, tag2, tag3"
      />
    </div>

    <div class="flex gap-2 pt-2">
      <button
        type="submit"
        class="btn btn-primary px-4 py-2 text-sm"
        :disabled="submitting || !isValid"
      >
        {{ submitting ? 'Saving...' : (post ? 'Update post' : 'Create post') }}
      </button>
      <button
        type="button"
        class="btn rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
        @click="emit('cancel')"
      >
        Cancel
      </button>
    </div>
  </form>
</template>