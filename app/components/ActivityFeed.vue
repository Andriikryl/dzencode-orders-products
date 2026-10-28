<script setup lang="ts">
import type { DomainEvent } from '~/lib/events'
import { useAppStore } from '~/composables/useAppStore'

const MAX_ENTRIES = 8

const store = useAppStore()
const entries = computed(() => store.state.events.slice(0, MAX_ENTRIES))

function describe(event: DomainEvent): string {
  switch (event.type) {
    case 'order:deleted':
      return `${event.title} (${event.productCount})`
    case 'product:deleted':
      return event.title
    case 'order:opened':
      return event.title
    case 'filter:changed':
      return event.value || '—'
  }
}
</script>

<template>
  <section class="activity card card-body surface">
    <h2 class="activity__title">{{ $t('dashboard.activity') }}</h2>

    <TransitionGroup v-if="entries.length" name="activity" tag="ul" class="activity__list">
      <li v-for="entry in entries" :key="entry.id" class="activity__item">
        <span class="activity__type">{{ entry.event.type }}</span>
        <span class="activity__text">{{ describe(entry.event) }}</span>
        <span class="activity__time">{{ entry.at }}</span>
      </li>
    </TransitionGroup>

    <p v-else class="activity__empty">{{ $t('dashboard.activityEmpty') }}</p>
  </section>
</template>

<style scoped>
.activity {
  padding: 22px;
}

.activity__title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px;
}

.activity__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.activity__item {
  display: grid;
  grid-template-columns: 130px minmax(0, 1fr) 80px;
  gap: 12px;
  align-items: center;
  padding: 8px 0;
  border-top: 1px solid var(--c-border);
}

.activity__type {
  color: var(--c-accent);
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, monospace;
}

.activity__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity__time {
  color: var(--c-text-muted);
  font-size: 12px;
  text-align: right;
}

.activity__empty {
  color: var(--c-text-muted);
  margin: 0;
}

.activity-enter-active,
.activity-leave-active {
  transition: all 0.25s ease;
}

.activity-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.activity-leave-to {
  opacity: 0;
}
</style>
