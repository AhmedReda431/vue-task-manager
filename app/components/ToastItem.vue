<script setup lang="ts">
import type { Toast } from '~/types/toast'

const props = defineProps<{
  toast: Toast
}>()

const emit = defineEmits<{
  dismiss: [id: string]
}>()

const progress = ref(100)
let progressInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (props.toast.duration && props.toast.duration > 0) {
    const step = 100 / (props.toast.duration / 50)
    progressInterval = setInterval(() => {
      progress.value -= step
      if (progress.value <= 0) {
        progress.value = 0
        if (progressInterval) clearInterval(progressInterval)
      }
    }, 50)
  }
})

onUnmounted(() => {
  if (progressInterval) clearInterval(progressInterval)
})

function dismiss() {
  emit('dismiss', props.toast.id)
}

const isSuccess = computed(() => props.toast.type === 'success')
</script>

<template>
  <div
    class="relative flex items-start gap-3 rounded-lg shadow-lg shadow-black/5 px-4 py-3 pr-10 min-w-[280px] max-w-md overflow-hidden bg-white border-l-4 text-ink"
    :class="isSuccess ? 'border-accent' : 'border-red-500'"
  >
    <!-- Success Icon -->
    <div
      v-if="isSuccess"
      class="mt-0.5 flex-shrink-0 text-accent"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>

    <!-- Error Icon -->
    <div
      v-else
      class="mt-0.5 flex-shrink-0 text-red-500"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </div>

    <!-- Message -->
    <p class="text-sm font-medium leading-relaxed">{{ toast.message }}</p>

    <!-- Close button -->
    <button
      type="button"
      class="absolute top-2 right-2 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      @click="dismiss"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>

    <!-- Progress bar -->
    <div
      v-if="toast.duration && toast.duration > 0"
      class="absolute bottom-0 left-0 h-0.5 transition-all duration-100 ease-linear"
      :class="isSuccess ? 'bg-accent' : 'bg-red-500'"
      :style="{ width: `${progress}%` }"
    />
  </div>
</template>