<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    message: string
    confirmLabel?: string
    danger?: boolean
  }>(),
  { confirmLabel: 'Confirm', danger: false }
)

defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="$emit('cancel')">
      <div class="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
        <h2 class="font-display text-lg font-semibold text-ink">{{ title }}</h2>
        <p class="mt-2 text-sm text-slate-600">{{ message }}</p>

        <div class="mt-5 flex justify-end gap-2">
          <button type="button" class="btn rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-black/5" @click="$emit('cancel')">
            Cancel
          </button>
          <button
            type="button"
            class="btn px-4 py-2 text-sm text-white"
            :class="danger ? 'rounded-md bg-red-600 hover:bg-red-700' : 'btn-primary'"
            @click="$emit('confirm')"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
