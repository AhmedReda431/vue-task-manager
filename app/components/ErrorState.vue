<script setup lang="ts">
defineProps<{
  message: string
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 rounded-lg border border-red-100 bg-red-50 py-12 text-center">
    <p class="text-sm font-medium text-red-700">{{ message }}</p>
    <button type="button" class="btn rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm text-red-700 hover:bg-red-100" @click="$emit('retry')">
      Try again
    </button>
  </div>
</template>
