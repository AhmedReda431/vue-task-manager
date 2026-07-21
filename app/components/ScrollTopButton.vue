<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const SCROLL_THRESHOLD = 500;
const isVisible = ref(false);

const handleScroll = () => {
  isVisible.value = window.scrollY > SCROLL_THRESHOLD;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <Transition
    enter-from-class="opacity-0 translate-y-4 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-4 scale-95"
    class="transition-all duration-300 ease-in-out"
  >
    <button
      v-if="isVisible"
      type="button"
      @click="scrollToTop"
      class="fixed bottom-12 right-12 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent-900/20 transition-all hover:scale-110 hover:bg-accent-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent-900 focus:ring-offset-2"
      aria-label="Scroll to top"
    >
      <!-- Modern Arrow Icon -->
      <svg
        xmlns="http://w3.org"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2.5"
        stroke="currentColor"
        class="h-5 w-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
        />
      </svg>
    </button>
  </Transition>
</template>
