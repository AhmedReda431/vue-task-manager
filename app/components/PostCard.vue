<script setup lang="ts">
import type { Post } from '~/types/post'

const props = defineProps<{
  post: Post
}>()

// JSONPlaceholder titles/bodies come in all-lowercase - capitalize the
// title so it reads like a real headline instead of raw API output.
const title = computed(() => props?.post?.title?.charAt?.(0)?.toUpperCase() + props?.post?.title?.slice(1))
</script>

<template>
  <article class="task-card task-card-enter rounded-xl bg-white p-4">
    <div class="mb-1.5 flex items-center gap-2 text-xs text-slate-400">
      <span class="rounded-full bg-black/5 px-2 py-0.5 font-medium">#{{ post.id }}</span>
      <span>User {{ post.userId }}</span>
    </div>
    <h3 class="font-medium text-ink">{{ title }}</h3>
    <p class="mt-1 line-clamp-2 text-sm text-slate-500">{{ post.body }}</p>
  </article>
</template>
