<script setup lang="ts">
import type { Post } from '~/types/post'

defineProps<{
  post: Post
}>()

const emit = defineEmits<{
  edit: [post: Post]
  delete: [id: number]
}>()
</script>

<template>
  <article class="task-card rounded-xl bg-white p-5 transition-shadow hover:shadow-md">
    <div class="mb-3 flex items-start justify-between gap-4">
      <NuxtLink
        :to="`/posts/${post.id}`"
        class="font-display text-lg font-semibold text-ink hover:text-accent transition-colors"
      >
        {{ post.title }}
      </NuxtLink>
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="p-1.5 rounded-lg text-gray-400 hover:text-accent hover:bg-accent/10 transition-colors"
          title="Edit post"
          @click="emit('edit', post)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          type="button"
          class="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Delete post"
          @click="emit('delete', post.id)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>

    <p class="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
      {{ post.body }}
    </p>

    <div class="flex flex-wrap items-center gap-2">
      <span
        v-for="tag in post.tags"
        :key="tag"
        class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
      >
        {{ tag }}
      </span>
    </div>

    <div class="mt-4 flex items-center gap-4 text-xs text-gray-400">
      <span class="flex items-center gap-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        {{ post?.views?.toLocaleString() }}
      </span>
      <span class="flex items-center gap-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
        {{ post?.reactions?.likes }}
      </span>
    </div>
  </article>
</template>