<script setup lang="ts">
const route = useRoute()

const links = [
  { to: '/', label: 'Tasks' },
  { to: '/posts', label: 'Posts' }
]

function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}
</script>

<template>
  <header class="app-header sticky top-0 z-40">
    <div class="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
      <NuxtLink to="/" class="flex items-center gap-2">
        <span class="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
            <path
              fill-rule="evenodd"
              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <span class="font-display text-base font-semibold text-ink">Tasklist</span>
      </NuxtLink>

      <nav class="flex items-center gap-1 rounded-full bg-black/5 p-1">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="tab-pill px-3 py-1.5 text-sm font-medium"
          :class="isActive(link.to) ? 'bg-white text-ink shadow-sm' : 'text-slate-500 hover:text-ink'"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
