<script setup lang="ts">
const store = useToastStore()
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="translate-x-full opacity-0 scale-95"
        enter-to-class="translate-x-0 opacity-100 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="translate-x-0 opacity-100 scale-100"
        leave-to-class="translate-x-full opacity-0 scale-95"
      >
        <ToastsToastItem
          v-for="toast in store.toasts"
          :key="toast.id"
          :toast="toast"
          class="pointer-events-auto"
          @dismiss="store.remove"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>