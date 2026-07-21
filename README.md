# Task Manager

A small task management app built with Nuxt 3 (Vue 3 + Composition API), Pinia, TypeScript, Tailwind CSS and SCSS.

## Features

- Task list with title, description, status (Pending / In Progress / Done) and due date
- Add / edit / delete tasks, with a form modal shared between the two flows
- Client-side validation: title is required, due date must be in the future
- Filter by status and search by title, combinable
- Task detail page (`/tasks/:id`) via file-based routing
- Loading, error and empty states, all handled explicitly (no silent failures)
- Mock "API" (local seed data + a simulated network delay) behind a Pinia store, so swapping in a real backend later is a one-file change
- A couple of unit tests with Vitest covering the validation helper and the store

## Stack

- Nuxt 3 (Composition API, `<script setup>`)
- Pinia for state management
- TypeScript
- Tailwind CSS for layout/utility styling, SCSS for shared tokens (colors, mixins) and a few hand-written animations
- Vitest + @vue/test-utils for unit tests

## Getting started

```bash
# install dependencies
npm install

# start the dev server (http://localhost:3000)
npm run dev

# run unit tests
npm run test

# production build
npm run build
npm run preview
```

## Project structure

```
app/
  components/       # TaskCard, TaskForm, TaskFilters, StatusBadge, loading/error/empty states, modal
  pages/
    index.vue       # task list
    tasks/[id].vue  # task detail page
  stores/
    tasks.ts        # Pinia store: state, mock fetch, CRUD, filtering getters
  types/
    task.ts         # Task / TaskStatus / TaskDraft types
  utils/
    validateTask.ts # form validation, unit tested in isolation
    mockTasks.ts     # seed data standing in for a backend
  assets/scss/
    main.scss       # color tokens, status color map, shared mixins
tests/
  validateTask.test.ts
  tasksStore.test.ts
```

## Design notes

- **Where the mock API lives**: `stores/tasks.ts` has a `fetchTasks` action that awaits a `setTimeout`-based delay before populating state from `utils/mockTasks.ts`. Everything downstream (loading spinner, error state, retry button) reacts to the store's `loading` / `error` flags, so pointing this at a real endpoint later just means replacing the body of that one action with a `$fetch` call.
- **Validation** is a plain function (`utils/validateTask.ts`) rather than being baked into the form component, so it can be unit tested without mounting anything.
- **Styling split**: Tailwind utility classes handle spacing/layout directly in templates; SCSS (`main.scss`) holds the color tokens, the status-color map, and a couple of small mixins/animations that are easier to express as real CSS than as utility classes.
- **Filtering** (status + search) is a Pinia getter (`filteredTasks`) so the list, the "X of Y shown" count, and any future consumer all stay in sync automatically.

## Possible next steps

- Swap the mock store action for a real `$fetch`/`useFetch` call once there's a backend
- Persist tasks (localStorage or a real API) so they survive a refresh
- Add pagination or virtualization if the task list grows large
